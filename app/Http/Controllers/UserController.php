<?php

namespace App\Http\Controllers;

use App\Models\Divisi;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('karyawan/index', [
            'users' => User::with('divisi')->get(),
            'divisis' => Divisi::get()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'nullable|email|unique:users,email',
            'password' => 'nullable|min:8',
            'nik' => 'required|string|max:8',
            'divisi_id' => 'required|exists:divisis,id',
            'tgl_lahir' => 'nullable',
            'jenis_kelamin' => 'nullable',
            'alamat' => 'nullable|string|max:255',
            'nomor_telepon' => 'required|string|max:20',
            'tgl_masuk' => 'nullable|date',
            'status' => 'required|in:Aktif,Tidak Aktif',
        ]);

        $user = User::create($data);
        $user->divisis()->sync($request->divisi_id);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $User)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $User)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'nullable|email|unique:users,email',
            'password' => 'nullable|min:8',
            'nik' => 'required|string|max:8',
            'divisi_id' => 'required|exists:divisis,id',
            'tgl_lahir' => 'nullable',
            'jenis_kelamin' => 'nullable',
            'alamat' => 'nullable|string|max:255',
            'nomor_telepon' => 'required|string|max:20',
            'tgl_masuk' => 'nullable|date',
            'status' => 'required|in:Aktif,Tidak Aktif',
        ]);

        $user->update($data);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
    }
}
