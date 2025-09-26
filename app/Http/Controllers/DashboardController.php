<?php

namespace App\Http\Controllers;

use App\Models\Absensi;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {

        $userId = Auth::user()->id;
        $today = Carbon::now()->format('Y-m-d');

        $absensiToday = Absensi::where('user_id', $userId)
        ->where('tanggal', $today)
        ->first();

        return Inertia::render('dashboard/index', [
            'absensiToday' => $absensiToday
        ]);
    }

    public function documentation()
    {
        return Inertia::render('dashboard/documentation', [
            'title' => 'App documentation',
            'content' => file_get_contents(base_path('README.md')),
        ]);
    }
}
