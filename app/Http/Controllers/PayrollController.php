<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePayrollRequest;
use App\Http\Requests\UpdatePayrollRequest;
use App\Http\Requests\BulkUpdatePayrollRequest;
use App\Http\Requests\BulkDeletePayrollRequest;
use App\Models\Payroll;
use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;


class PayrollController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
{
    $this->pass("index payroll");

    $user = Auth::user();
    $isAdmin = $user->roles()->whereIn('name', ['admin', 'superadmin'])->exists();

    $query = Payroll::selectRaw('Date_FORMAT(periode, "%Y-%m") as periode_bulan')
        ->selectRaw('COUNT(id) as jumlah_karyawan')
        ->selectRaw('SUM(total_gaji) as total_gaji')
        ->groupBy('periode_bulan')
        ->orderByDesc('periode_bulan')
        ->whereHas('user.roles', function($q) {
                $q->whereNotIn('name', ['superadmin']); // Exclude superadmin
            });

         if (!$isAdmin) {
            $query->where('user_id', $user->id);
        }

        $payrolls = $query->get()
        ->map(function($item) { 
            $item->periode_label = Carbon::createFromFormat('Y-m', $item->periode_bulan)
                ->translatedFormat('F Y');
            return $item;
        });

        $users = [];
        if ($isAdmin) {
            $users = User::select('id', 'name')->get();
        }

    return Inertia::render('payroll/index', [
        'payrolls' => $payrolls,
        'query' => $request->input(),
        'users' => $users,
        'isAdmin' => $isAdmin,
        'permissions' => [
            'canAdd' => $this->user->can('create payroll'),
            'canShow' => $this->user->can("show payroll"),
            'canDelete' => $this->user->can("delete payroll"),
        ]
    ]);
}

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePayrollRequest $request)
    {
        try {
            $this->pass("create payroll");

            $data = $request->validated();

            $tgl_pengajuan = Carbon::parse($data['tanggal'] . ' 12:00:00')
                ->timezone('Asia/Makassar')
                ->format('Y-m-d');

          // 'YYYY-MM'
            $data['periode'] = Carbon::parse($data['periode'])->format('Y-m');
            $data['tanggal'] = $tgl_pengajuan;
            $data['status'] = 'Draft';
            $data['approval_status'] = 'Pending';
            $data['approved_by'] = null;
            $data['approved_at'] = null;

            $payroll = Payroll::create($data);

            // Log::debug('Payroll created:', [
            //     'id' => $payroll->id,
            //     'user_id' => $payroll->user_id, 
            //     'periode' => $payroll->periode
            // ]);

            return redirect()->route('payroll.index')->with('success', 'Payroll created successfully');

        } catch (\Exception $e) {
            Log::error('Store error: ' . $e->getMessage());
            return back()->with('error', 'Gagal membuat payroll: ' . $e->getMessage());
        }
    }

    public function availablePeriodes(User $user) 
    {
        $periodes = $user->absensis()
        ->selectRaw("DATE_FORMAT(tanggal, '%Y-%m') as periode")
        ->distinct()
        ->pluck('periode');

        return response()->json($periodes);
    }

    public function absensiSummary(User $user, $periode)
    {
        try {
            $periode = Carbon::createFromFormat('Y-m', $periode)->startOfMonth();
        } catch (\Exception $e) {
            return response()->json(['error' => 'Format periode tidak valid.'], 400);
        }

        $payroll = new Payroll([
            'user_id' => $user->id,
            'periode' => $periode,
        ]);

        $summary = $this->generatePayrollSummary($payroll, $periode); 

        return response()->json($summary);
    }

    /**
     * Display the specified resource.
     */
    public function showByPeriode(string $periode)
    {
        $user = Auth::user();
        $isAdmin = $user->roles()->whereIn('name', ['admin', 'superadmin'])->exists();

        try {
            $periodeCarbon = Carbon::createFromFormat('Y-m', $periode);
        } catch (\Exception $e) {
            $periodeCarbon = Carbon::parse($periode);
        }

        $periodeLabel = $periodeCarbon->translatedFormat('F Y');

        

        $query = Payroll::with(['user.roles'])
            ->where('periode', 'LIKE', $periode . '%')
            ->whereHas('user.roles', function($q) {
                $q->whereNotIn('name', ['superadmin']); // Exclude superadmin
            });
        
            // Log::info('Payrolls for periode ' . $periode . ':', [
        //     'count' => $payrolls->count(),
        //     'data' => $payrolls->pluck('id', 'user_id')
        // ]);

        if (!$isAdmin) {
            $query->where('user_id', $user->id);
        }

        $payrolls = $query->get();

        return Inertia::render('payroll/periode-show', [
            'periode' => $periode,
            'periode_label' => $periodeLabel,
            'payrolls' => $payrolls,
            'query' => request()->query(),
            'isAdmin' => $isAdmin,
            'permissions' => [
                'canShow' => $this->user->can("show payroll"),
                'canDelete' => $this->user->can("delete payroll"),
            ]
        ]);
    }

    public function showUserPayroll(string $periode, User $user)
    {
        // normalize periode
        try {
            $periodeCarbon = Carbon::createFromFormat('Y-m', $periode);
        } catch (\Exception $e) {
            $periodeCarbon = Carbon::parse($periode)->startOfMonth();
            $periode = $periodeCarbon->format('Y-m');
        }

        $payroll = Payroll::with(['user', 'approver'])
        ->where('periode', 'LIKE', $periode . '%')
        ->where('user_id', $user->id)
        ->first();

        if (!$payroll) {
            abort(404, 'Payroll untuk karyawan ini di periode tersebut tidak ditemukan.');
        }

        $summary = $this->generatePayrollSummary($payroll, $periodeCarbon);

        // dd($periode);


        return Inertia::render('payroll/show', [
            'periode' => $periode,
            'periode_label' => $periodeCarbon->translatedFormat('F Y'),
            'user' => $payroll->user,
            'payroll' => $payroll,
            'summary' => $summary,
            'permissions' => [
                'canUpdate' => $this->user->can("update payroll"),                
            ]
        ]);
    }


    private function generatePayrollSummary(Payroll $payroll, Carbon $periode)
    {
        $user = $payroll->user;

        $bulan = $periode->month;
        $tahun = $periode->year;

        $absensis = $user->absensis()
            ->whereYear('tanggal', $tahun)
            ->whereMonth('tanggal', $bulan)
            ->get();

        $gajiPokok = $user->custom_gaji_pokok ?? ($user->roles->first()?->gaji_pokok ?? 0);
        $tunjangan = $user->custom_tunjangan ?? ($user->roles->first()?->tunjangan ?? 0);

        $hadir = $absensis->whereIn('status', ['Hadir', 'Telat'])->count();
        $izin = $absensis->whereIn('status', ['Sakit', 'Izin', 'Lainnya'])->count();
        $cuti = $absensis->where('status', 'Cuti')->count();
        $alpha = $absensis->where('status', 'Alpha')->count();
        $telat = $absensis->where('status', 'Telat')->count();

        $potonganTelat = $telat * 10000;
        $potonganAlpha = $alpha * 20000;
        $totalPotongan = $potonganTelat + $potonganAlpha;
        $totalGaji = ($gajiPokok + $tunjangan) - $totalPotongan;

        return [
            'nama' => $user->name,
            'role' => $user->roles->first()?->name ?? '-',
            'periode' => $periode->format('Y-m'),
            'gaji_pokok' => $gajiPokok,
            'tunjangan' => $tunjangan,
            'hadir' => $hadir,
            'izin' => $izin,
            'cuti' => $cuti,
            'alpha' => $alpha,
            'telat' => $telat,
            'potongan' => $totalPotongan,
            'total_gaji' => $totalGaji,
        ];
    }

    public function approveApprovalStatus(Request $request, Payroll $payroll)
    {
        $this->pass('approve payroll');

        $request->validate([
            'approval_status' => 'required|in:Approved,Rejected',
        ]);

        $payroll->load(['user', 'approver']);


        DB::transaction(function () use ($request, $payroll){
            $payroll->update([
                'approval_status' => $request->approval_status,
                'approved_by' => Auth::id(),
                'approved_at' => now(),
            ]);



            return back()->with('success', 'Payroll approved successfully');
        });
    }
    public function approveApproval(Request $request, Payroll $payroll)
    {
        $this->pass('approve payroll');

        $payroll->load(['user', 'approver']);

        $request->validate([
            'status' => 'required|in:Draft,Finalized',
        ]);

        DB::transaction(function () use ($request, $payroll){
            $payroll->update([
                'status' => $request->status,
            ]);



            return back()->with('success', 'Payroll approved successfully');
        });
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePayrollRequest $request, Payroll $payroll)
    {
        $this->pass("update payroll");

        $data = $request->validated();
        $payroll->update($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Payroll $payroll)
    {
        $this->pass("delete payroll");

        $payroll->delete();
    }

    /**
     * BulkUpdate the specified resource from storage.
     */
    public function bulkUpdate(BulkUpdatePayrollRequest $request)
    {
        $this->pass("update payroll");

        $data = $request->validated();
        Payroll::whereIn('id', $data['payroll_ids'])->update($data);
    }

    /**
     * BulkDelete the specified resource from storage.
     */
    public function bulkDelete(BulkDeletePayrollRequest $request)
    {
        $this->pass("delete payroll");

        $data = $request->validated();
        Payroll::whereIn('id', $data['payroll_ids'])->delete();
    }

    
    
    
}
