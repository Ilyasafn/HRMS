<?php

namespace App\Http\Controllers;

use App\Http\Requests\BulkDeleteUserRequest;
use App\Http\Requests\BulkUpdateUserRequest;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\Absensi;
use App\Models\Cuti;
use App\Models\Divisi;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->pass('index user');

        $data = User::query()
            ->with(['media', 'roles', 'divisi', 'absensis'])
             ->whereHas('roles', function($q) {
                $q->whereNotIn('name', ['superadmin']); // Exclude superadmin
            })
            ->when($request->name, function($q, $v) {
                $q->where('name', $v);
            });

        return Inertia::render('user/index', [
            'users' => $data->get(),
            'query' => $request->input(),
            'divisis' => Divisi::get(),
            'absensis' => Absensi::get(),
            'roles' => Role::whereNot('name', "superadmin")->get()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $this->pass('create user');

        $data = $request->validated();
        $user = User::create($data);

        $user->syncRoles($data['roles']);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $this->pass('show user');

        $user->load(['roles', 'divisi']);

    $totalHadir = Absensi::where('user_id', $user->id)
        ->where('status', 'Hadir')
        ->count();

    $totalTelat = Absensi::where('user_id', $user->id)
        ->where('status', 'Telat')
        ->count();

    $totalIzin = Absensi::where('user_id', $user->id)
        ->whereIn('status', ['Sakit', 'Izin', 'Lainnya'])
        
        ->count();

    $totalCuti = Cuti::where('user_id', $user->id)
        ->where('approval_status', 'Approved')
        ->count();

    $totalAlpha = Absensi::where('user_id', $user->id)
        ->where('status', 'Alpha')
        ->count();
    

        // Data untuk chart
        $chartData = Absensi::where('user_id', $user->id)
        ->whereYear('tanggal', now()->year)
         ->selectRaw('MONTH(tanggal) as month, 
                SUM(CASE WHEN status IN ("Hadir", "Telat") THEN 1 ELSE 0 END) as hadir,
                SUM(CASE WHEN status = "Alpha" THEN 1 ELSE 0 END) as alpha,
                SUM(CASE WHEN status IN ("Sakit", "Izin", "Lainnya") THEN 1 ELSE 0 END) as izin,
                SUM(CASE WHEN status = "Cuti" THEN 1 ELSE 0 END) as cuti')
        ->groupBy('month')
        ->get()
        ->map(function ($item) {
        return [
            'month' => Carbon::create()->month($item->month)->format('F'),
            'hadir' => (int) $item->hadir,       
            'alpha' => (int) $item->alpha,   
            'izin' => (int) $item->izin,         
            'cuti' => (int) $item->cuti          
        ];
    });

        $allMonth = [];
        for($i = 1; $i <= 12; $i++) {
            $monthName = Carbon::create()->month($i)->format('F');
            $existingMonth = collect($chartData)->firstWhere('month', $monthName);
            $allMonth[] =  $existingMonth ?: [
                'month' => $monthName,
                'hadir' => 0,
                'telat  ' => 0,
                'alpha' => 0,
                'izin' => 0,
                'cuti' => 0
            ];
        }


        return Inertia::render('user/show', [
            'user' => $user,
            'total_absensi' => [
            'hadir' => $totalHadir,
            'telat' => $totalTelat,
            'izin' => $totalIzin,
            'cuti' => $totalCuti,
            'alpha' => $totalAlpha,
            'total' => $totalHadir + $totalTelat   
        ],  
        'chart_data' => $allMonth // Kosongin dulu
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $this->pass('update user');

        $data = $request->validated();
        $user->update($data);

        $user->syncRoles($data['roles']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $this->pass('delete user');

        $user->delete();
    }

    public function bulkUpdate(BulkUpdateUserRequest $request)
    {
        $this->pass('update user');

        $data = $request->validated();
        User::whereIn('id', $data['user_ids'])->update($data);
    }
    
    public function bulkDelete(BulkDeleteUserRequest $request)
    {
        $this->pass('delete user');

        $data = $request->validated();
        User::whereIn('id', $data['user_ids'])->delete();
    }

    public function archived()
    {
        $this->pass('archived user');

        return Inertia::render('user/archived', [
            'users' => User::onlyTrashed()->get(),
        ]);
    }

    public function restore($user)
    {
        $this->pass('restore user');

        $user = User::onlyTrashed()->find($user);
        $user->restore();
    }

    public function forceDelete($user)
    {
        $this->pass('force delete user');

        $user = User::onlyTrashed()->find($user);
        $user->forceDelete();
    }
}
