<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAbsensiRequest;
use App\Http\Requests\UpdateAbsensiRequest;
use App\Http\Requests\BulkUpdateAbsensiRequest;
use App\Http\Requests\BulkDeleteAbsensiRequest;
use App\Models\Absensi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\UploadAbsensiMediaRequest;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class AbsensiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->pass("index absensi");
        
        $query = Absensi::query()
        ->selectRaw('tanggal, count(*) as user_counts')
        ->groupBy('tanggal')
        ->orderByDesc('tanggal');

        if($request->filled('name')) {
            $query->join('users','users.id', '=', 'absensis.user_id')
                        ->where('name', 'like', '%' . $request->name . '%')
                        ->selectRaw('tanggal, count(*) as user_counts')
                        ->groupBy('absensis.tanggal');
        }

        $data = $query->get();

        return Inertia::render('absensi/index', [
            'absensis' => $data,
            'query' => $request->input(),
            'users' => User::all(),
            'permissions' => [
                'canAdd' => $this->user->can("create absensi"),
                'canShow' => $this->user->can("show absensi"),
                'canUpdate' => $this->user->can("update absensi"),
                'canDelete' => $this->user->can("delete absensi"),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAbsensiRequest $request)
    {
        $this->pass("create absensi");

        $data = $request->validated();
        Absensi::create($data);
    }

    /**
     * Display the specified resource.
     */
    public function show( $tanggal)
    {
        $this->pass("show absensi");

        $absensi = Absensi::whereDate('tanggal', $tanggal)
        ->with(['user', 'approvedBy'])
        ->get()
        ->map(function($item){
            if($item->approved_status === "Pending") {
                $item->approved_by = null;
            }
            return $item;
        });

        return Inertia::render('absensi/show', [
            'absensis' => $absensi,
            'tanggal' => $tanggal,
            'permissions' => [
                'canUpdate' => $this->user->can("update absensi"),
                'canDelete' => $this->user->can("delete absensi"),
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAbsensiRequest $request, Absensi $absensi)
    {
        $this->pass("update absensi");

        $data = $request->validated();
        $absensi->update($data);
    }

    public function approval(Request $request, Absensi $absensi)
    {
        $this->pass("update absensi");

        $validated = $request->validate([
            'approval_status' => 'required|in:Approved,Rejected',
        ]);

        $absensi->update([
            'approval_status' => $validated['approval_status'],
            'approved_by' => $this->user->id,
        ]);

        return redirect()->back()->with('success', 'Absensi approved');
    }

    public function handleAbsensi(Request $request)
    {
        // $this->pass('create/update absensi');

        $userId = Auth::id();
        $today = Carbon::today();
        $now = Carbon::now();
        $status = $this->determineStatusMasuk($now);


        $absensi = Absensi::where('user_id', $userId)
        ->whereDate('tanggal', $today)
        ->first();

        if($absensi && in_array($absensi->$status, ['Sakit', 'Izin', 'Lainnya'])) {

            return redirect()->back()->with('error', 'Anda sudah melakukan izin pada hari ini');
        }
        
        if(!$absensi) {

            $newAbsensi = Absensi::create([
                'user_id' => $userId,
                'tanggal' => $today,
                'jam_masuk' => $now->format('H:i:s'),
                'jam_keluar' => null,
                'status' => $status,
                'approval_status' => "Pending",
            ]);

            return redirect()->back()->with('success', 'Check-In Berhasil' . $status);
        }

        if(is_null($absensi->jam_keluar)){
            $absensi->update([
                'jam_keluar' => $now->format('H:i:s'),
            ]);

            return redirect()->back()->with('success', 'Check-Out Berhasil');
        }


        return redirect()->back()->with('error', 'Anda sudah melakukan absensi hari ini!');
    }

    public function ajukanIzin(Request $request) {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'tipe' => 'required|in:Sakit,Izin,Lainnya', // Tambah Lainnya
            'keterangan' => 'required|string|max:500',
            'jenis_lainnya' => 'required_if:tipe,Lainnya|string|max:100', // Field baru untuk spesifikasi
        ]);

        $userId = Auth::id();
        $tanggal = Carbon::parse($validated['tanggal'])->format('Y-m-d');

        $existingAbsensi = Absensi::where('user_id', $userId)
        ->where('tanggal', $tanggal)
        ->first();

        if($existingAbsensi){
            return redirect()->back()->with('error', 'Anda sudah melakukan absensi hari ini!');
        }

        $keterangan = $validated['tipe'] === 'Lainnya'
        ? $validated['jenis_lainnya'] . ' - ' . $validated['keterangan']
        : $validated['keterangan'];

        $absensi = Absensi::create([
            'user_id' => $userId,
            'tanggal' => $tanggal,
            'jam_masuk' => null,
            'jam_keluar' => null,
            'status' => $validated['tipe'],
            'keterangan' => $keterangan,
            'approval_status' => 'Pending',
        ]);

        return redirect()->back()->with('success', 'Izin berhasil di ajukan');
    }

    private function determineStatusMasuk(Carbon $waktuMasuk)
    {
       $jamMasukStandard = Carbon::createFromTimeString(
        config('absensi.jam_kerja.masuk', '08:00:00')
       );

       $toleransiMenit = config('absensi.toleransi_masuk', 15);

       $batasToleransi = $jamMasukStandard->copy()->addMinutes($toleransiMenit);

       $waktuMasukTime = Carbon::createFromTimeString($waktuMasuk->format('H:i:s'));

       if($waktuMasukTime->lessThanOrEqualTo($batasToleransi)) {
        return 'Hadir';
       } else {
        return 'Telat';
       }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Absensi $absensi)
    {
        $this->pass("delete absensi");

        $absensi->delete();
    }

    /**
     * BulkUpdate the specified resource from storage.
     */
    public function bulkUpdate(BulkUpdateAbsensiRequest $request)
    {
        $this->pass("update absensi");

        $data = $request->validated();
        Absensi::whereIn('id', $data['absensi_ids'])->update($data);
    }

    /**
     * BulkDelete the specified resource from storage.
     */
    public function bulkDelete(BulkDeleteAbsensiRequest $request)
    {
        $this->pass("delete absensi");

        $data = $request->validated();
        Absensi::whereIn('id', $data['absensi_ids'])->delete();
    }

    /**
     * View archived resource from storage.
     */
    public function archived()
    {
        $this->pass("archived absensi");

        return Inertia::render('absensi/archived', [
            'absensis' => Absensi::onlyTrashed()->get(),
        ]);
    }

    /**
     * Restore the specified resource from storage.
     */
    public function restore($id)
    {
        $this->pass("restore absensi");

        $model = Absensi::onlyTrashed()->findOrFail($id);
        $model->restore();
    }

    /**
     * Force delete the specified resource from storage.
     */
    public function forceDelete($id)
    {
        $this->pass("force delete absensi");

        $model = Absensi::onlyTrashed()->findOrFail($id);
        $model->forceDelete();
    }
    
    /**
     * Register media conversions.
     */
    public function uploadMedia(UploadAbsensiMediaRequest $request, Absensi $absensi)
    {
        $this->pass("update absensi");

        $data = $request->validated();
        $absensi->addMedia($data['file'])->toMediaCollection();
    }
}
