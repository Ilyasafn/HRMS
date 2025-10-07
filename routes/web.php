<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DivisiController;
use App\Http\Controllers\AbsensiController;
use App\Http\Controllers\CutiController;




Route::get('/', [WelcomeController::class, 'index'])->name('home');
Route::get('/about', [WelcomeController::class, 'about'])->name('about');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('documentation', [DashboardController::class, 'documentation'])->name('documentation');

    Route::get('user/{user}', [UserController::class, 'show'])->name('user.show');
    Route::put('user/bulk', [UserController::class, 'bulkUpdate'])->name('user.bulk.update');
    Route::delete('user/bulk', [UserController::class, 'bulkDelete'])->name('user.bulk.destroy');
    Route::get('user/archived', [UserController::class, 'archived'])->name('user.archived');
    Route::put('user/{user}/restore', [UserController::class, 'restore'])->name('user.restore');
    Route::delete('user/{user}/force-delete', [UserController::class, 'forceDelete'])->name('user.force-delete');
    Route::apiResource('user', UserController::class);

    Route::apiResource('role', RoleController::class);

    Route::post('permission/resync', [PermissionController::class, 'resync'])->name('permission.resync');
    Route::apiResource('permission', PermissionController::class);

    Route::apiResource('doc', MediaController::class);

    Route::put('/bulk', [DivisiController::class, 'bulkUpdate'])->name('divisi.bulk.update');
    Route::delete('divisi/bulk', [DivisiController::class, 'bulkDelete'])->name('divisi.bulk.destroy');
    Route::get('divisi/archived', [DivisiController::class, 'archived'])->name('divisi.archived');
    Route::put('divisi/{divisi}/restore', [DivisiController::class, 'restore'])->name('divisi.restore');
    Route::delete('divisi/{divisi}/force-delete', [DivisiController::class, 'forceDelete'])->name('divisi.force-delete');
    Route::apiResource('divisi', DivisiController::class);
    
    Route::put('absensi/bulk', [AbsensiController::class, 'bulkUpdate'])->name('absensi.bulk.update');
    Route::delete('absensi/bulk', [AbsensiController::class, 'bulkDelete'])->name('absensi.bulk.destroy');
    Route::get('absensi/archived', [AbsensiController::class, 'archived'])->name('absensi.archived');
    Route::put('absensi/{absensi}/restore', [AbsensiController::class, 'restore'])->name('absensi.restore');
    Route::delete('absensi/{absensi}/force-delete', [AbsensiController::class, 'forceDelete'])->name('absensi.force-delete');
    Route::post('absensi/{absensi}/upload-media', [AbsensiController::class, 'uploadMedia'])->name('absensi.upload-media');
    Route::post('absensi/handle', [AbsensiController::class, 'handleAbsensi'])->name('absensi.handle');
    Route::post('absensi/ajukan-izin', [AbsensiController::class, 'ajukanIzin'])->name('absensi.ajukan-izin');
    Route::put('absensi/{absensi}/approval', [AbsensiController::class, 'approval'])->name('absensi.approval');
    Route::apiResource('absensi', AbsensiController::class);
    Route::get('absensi/{tanggal}', [AbsensiController::class, 'show'])->name('absensi.show');

    Route::put('cuti/bulk', [CutiController::class, 'bulkUpdate'])->name('cuti.bulk.update');
    Route::delete('cuti/bulk', [CutiController::class, 'bulkDelete'])->name('cuti.bulk.destroy');
    Route::get('cuti/archived', [CutiController::class, 'archived'])->name('cuti.archived');
    Route::put('cuti/{cuti}/restore', [CutiController::class, 'restore'])->name('cuti.restore');
    Route::delete('cuti/{cuti}/force-delete', [CutiController::class, 'forceDelete'])->name('cuti.force-delete');
    Route::post('cuti/{cuti}/upload-media', [CutiController::class, 'uploadMedia'])->name('cuti.upload-media');
    Route::post('cuti/ajukan-cuti', [CutiController::class, 'ajukanCuti'])->name('cuti.ajukan-cuti');
    Route::put('cuti/{cuti}/approval', [CutiController::class, 'approval'])->name('cuti.approval');
    Route::apiResource('cuti', CutiController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
