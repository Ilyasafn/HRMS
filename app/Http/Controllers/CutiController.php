<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCutiRequest;
use App\Http\Requests\UpdateCutiRequest;
use App\Http\Requests\BulkUpdateCutiRequest;
use App\Http\Requests\BulkDeleteCutiRequest;
use App\Models\Cuti;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\UploadCutiMediaRequest;
use App\Models\Absensi;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CutiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->pass("index cuti");

        $user = Auth::user();
    
        $isAdmin = $user->roles()->whereIn('name', ['admin', 'superadmin'])->exists();        

        $query = Cuti::with(['user', 'approvedBy']);
        if (!$isAdmin) {
            $query->where('user_id', $user->id);
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        
        $cutis = $query->orderBy('created_at', 'desc')
        ->whereHas('user.roles', function($q) {
                $q->whereNotIn('name', ['superadmin']); // Exclude superadmin
        })
        ->get();

        $users = [];
        if ($isAdmin) {
            $users = User::select('id', 'name')->get();
        }

        return Inertia::render('cuti/index', [
            'cutis' => $cutis,
            'query' => $request->query(),
            'users' => $users,
            'isAdmin' => $isAdmin,
            'permissions' => [
                'canAdd' => $this->user->can("create cuti"),
                'canShow' => $this->user->can("show cuti"),
                'canUpdate' => $this->user->can("update cuti"),
                'canDelete' => $this->user->can("delete cuti"),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCutiRequest $request)
    {
        $this->pass("create cuti");

        date_default_timezone_set('Asia/Makassar');

        $validated = $request->validated();

        if (empty($validated['tgl_mulai']) || empty($validated['tgl_selesai'])) {
        return redirect()->back()->with('error', 'Tanggal mulai dan selesai wajib diisi');
    }

        $jumlah_hari = $this->calculateWorkingDays(
        Carbon::parse($validated['tgl_mulai']),
        Carbon::parse($validated['tgl_selesai'])
    );

        $tgl_pengajuan = Carbon::parse($validated['tgl_pengajuan'] . ' 12:00:00') // waktu tengah hari
        ->timezone('Asia/Makassar')
        ->format('Y-m-d');
        $tgl_mulai = Carbon::parse($validated['tgl_mulai'] . ' 12:00:00') // waktu tengah hari
        ->timezone('Asia/Makassar')
        ->format('Y-m-d');
        $tgl_selesai = Carbon::parse($validated['tgl_selesai'] . ' 12:00:00') // waktu tengah hari
        ->timezone('Asia/Makassar')
        ->format('Y-m-d');

        $validated['tgl_pengajuan'] = $tgl_pengajuan;
        $validated['tgl_mulai'] = $tgl_mulai;
        $validated['tgl_selesai'] = $tgl_selesai;
        $validated['jumlah_hari'] = $jumlah_hari;
        $validated['approval_status'] = 'Approved';
        $validated['approved_by'] = Auth::id();
        $validated['approved_at'] = now();

        Cuti::create($validated);

        return redirect()->back()->with('success', 'Cuti berhasil diajukan');
    }


private function calculateWorkingDays(string $start, string $end): int
{
    $startDate = Carbon::parse($start);
    $endDate = Carbon::parse($end);
    
    $totalDays = 0;
    $current = $startDate->copy();
    
    while ($current->lte($endDate)) {
        // Skip Saturday (6) and Sunday (7)
        if (!$current->isWeekend()) {
            $totalDays++;
        }
        $current->addDay();
    }
    
    return $totalDays;
}
    public function approval(Request $request, Cuti $cuti) 
    {
        $this->pass('approve cuti');

        $request->validate([
            'approval_status' => 'required|in:Approved,Rejected',
        ]);

        $cuti->load('user');

        DB::transaction(function () use ($request, $cuti) {
            $cuti->update([
                    'approval_status' => $request->approval_status,
                    'approved_by' => Auth::id(),
                    'approved_at' => now(),
                ]);
            
            if($request->approval_status === 'Approved') {
                $this->generateAbsensiFromCuti($cuti);

               if ($cuti->user) {
                $cuti->user->decrement('sisa_cuti_tahunan', $cuti->jumlah_hari);
                $cuti->user->increment('total_cuti_diambil', $cuti->jumlah_hari);
            } else {
                Log::error("User not found via relationship for cuti ID: {$cuti->id}");
            }
            }
        });

            return redirect()->back()->with('success', "Cuti berhasil di-{$request->approval_status}");
    }

    private function generateAbsensiFromCuti(Cuti $cuti) 
    {
        $startDate = Carbon::parse($cuti->tgl_mulai);
        $endDate = Carbon::parse($cuti->tgl_selesai);

        $absensiData = [];

        for($date = $startDate; $date->lte($endDate); $date->addDay()) {
            
            if($date->isWeekend()){
                continue;
            }

            try {
            Absensi::updateOrCreate(
                [
                    'user_id' => $cuti->user_id,
                    'tanggal' => $date->format('Y-m-d')
                ],
                [
                    'jam_masuk' => null,
                    'jam_keluar' => null,
                    'status' => 'Cuti',
                    'keterangan' => "Cuti: {$cuti->jenis_cuti} - {$cuti->alasan}",
                    'approval_status' => 'Approved',
                    'approved_by' => Auth::id(),
                    'approved_at' => now(),
                ]
            );            
        } catch (\Exception $e) {
            Log::error("Failed to generate absensi for user {$cuti->user_id} on {$date->format('Y-m-d')}: " . $e->getMessage());
        }

            if(!empty($absensiData)) {
                Absensi::insert($absensiData);
            }
    }
}
    public function ajukanCuti(Request $request) 
    {
        $validated = $request->validate([
            'tgl_mulai' => 'required|date',
            'tgl_selesai' => 'required|date|after_or_equal:tgl_mulai',
            'jenis_cuti' => 'required|in:Cuti Tahunan,Cuti Besar,Cuti Sakit,Cuti Melahirkan,Cuti Lainnya',
            'alasan' => 'required|string|max:500',
        ]);


        $cuti = Cuti::create([
            'user_id' => Auth::id(),
            'tgl_pengajuan' => date('Y-m-d'),
            'tgl_mulai' => $validated['tgl_mulai'], 
            'tgl_selesai' => $validated['tgl_selesai'], 
            'jumlah_hari' => $this->calculateWorkingDays(
                $validated['tgl_mulai'],
                $validated['tgl_selesai']
            ),
            'alasan' => $validated['alasan'],
            'jenis_cuti' => $validated['jenis_cuti'],
            'approval_status' => 'Pending',
        ]);

        return redirect()->back()->with('success', 'Cuti berhasil diajukan! Menunggu approval.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Cuti $cuti)
    {
        $this->pass("show cuti");
        $cuti->load('user');
        $user = Auth::user();

        $isAdmin = $user->roles()->whereIn('name', ['admin', 'superadmin'])->exists();

         // Untuk user biasa, pastikan hanya bisa akses cuti sendiri
        if (!$isAdmin && $cuti->user_id !== $user->id) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('cuti/show', [
            'cuti' => $cuti,
            'isAdmin' => $isAdmin,
            'permissions' => [
                'canUpdate' => $this->user->can("update cuti"),
                'canDelete' => $this->user->can("delete cuti"),
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCutiRequest $request, Cuti $cuti)
    {
        $this->pass("update cuti");

        $data = $request->validated();
        $cuti->update($data);

        $jumlah_hari = $this->calculateWorkingDays(
            Carbon::parse($data['tgl_mulai']),
            Carbon::parse($data['tgl_selesai']),
        );
        $cuti->update(['jumlah_hari' => $jumlah_hari]);

        return redirect()->back()->with('success', 'Cuti berhasil diupdate');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Cuti $cuti)
    {
        $this->pass("delete cuti");

        $cuti->delete();
    }

    /**
     * BulkUpdate the specified resource from storage.
     */
    public function bulkUpdate(BulkUpdateCutiRequest $request)
    {
        $this->pass("update cuti");

        $data = $request->validated();
        Cuti::whereIn('id', $data['cuti_ids'])->update($data);
    }

    /**
     * BulkDelete the specified resource from storage.
     */
    public function bulkDelete(BulkDeleteCutiRequest $request)
    {
        $this->pass("delete cuti");

        $data = $request->validated();
        Cuti::whereIn('id', $data['cuti_ids'])->delete();
    }

    /**
     * View archived resource from storage.
     */
    public function archived()
    {
        $this->pass("archived cuti");

        return Inertia::render('cuti/archived', [
            'cutis' => Cuti::onlyTrashed()->get(),
        ]);
    }

    /**
     * Restore the specified resource from storage.
     */
    public function restore($id)
    {
        $this->pass("restore cuti");

        $model = Cuti::onlyTrashed()->findOrFail($id);
        $model->restore();
    }

    /**
     * Force delete the specified resource from storage.
     */
    public function forceDelete($id)
    {
        $this->pass("force delete cuti");

        $model = Cuti::onlyTrashed()->findOrFail($id);
        $model->forceDelete();
    }
    
    /**
     * Register media conversions.
     */
    public function uploadMedia(UploadCutiMediaRequest $request, Cuti $cuti)
    {
        $this->pass("update cuti");

        $data = $request->validated();
        $cuti->addMedia($data['file'])->toMediaCollection();
    }
}
