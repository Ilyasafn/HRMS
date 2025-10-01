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
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class CutiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->pass("index cuti");
        
        $data = Cuti::query()
            ->with(['media', 'user', 'approvedBy'])
            ->when($request->name, function($q, $v){
                $q->where('name', $v);
            });

        return Inertia::render('cuti/index', [
            'cutis' => $data->get(),
            'query' => $request->input(),
            'users' => User::get(),
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

        $jumlah_hari = $this->calculateWorkingDays(
        Carbon::parse($validated['tgl_mulai']),
        Carbon::parse($validated['tgl_selesai'])
    );

        $tgl_pengajuan = Carbon::parse($validated['tgl_pengajuan'] . ' 12:00:00') // Tambah waktu tengah hari
        ->timezone('Asia/Makassar')
        ->format('Y-m-d');
        $tgl_mulai = Carbon::parse($validated['tgl_mulai'] . ' 12:00:00') // Tambah waktu tengah hari
        ->timezone('Asia/Makassar')
        ->format('Y-m-d');
        $tgl_selesai = Carbon::parse($validated['tgl_selesai'] . ' 12:00:00') // Tambah waktu tengah hari
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

    private function calculateWorkingDays(Carbon $start, Carbon $end): int
    {
        $totalDays = 0;
        $current = $start->copy();
        
        while ($current->lte($end)) {
            // Skip Saturday (6) and Sunday (7)
            if (!$current->isWeekend()) {
                $totalDays++;
            }
            $current->addDay();
        }
        
        return $totalDays;
    }

    /**
     * Display the specified resource.
     */
    public function show(Cuti $cuti)
    {
        $this->pass("show cuti");

        return Inertia::render('cuti/show', [
            'cuti' => $cuti,
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
