<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'alamat' => 'nullable|string',
            'no_telp' => 'nullable|string',
            'divisi_id' => 'required|exists:divisis,id',
            'roles' => 'nullable|array',
            'roles.*' => 'exists:roles,name',
            'nik' => 'nullable|string|max:8',
            'tgl_lahir' => 'nullable|date',
            'tgl_masuk' => 'nullable|date',
            'jenis_kelamin' => 'nullable|in:Laki-laki,Perempuan',
            'status' => 'nullable|in:Aktif,Tidak Aktif',
            'custom_gaji_pokok' => 'nullable|min:0',
            'custom_tunjangan' => 'nullable|min:0',
            'password' => 'required|confirmed',
        ];
    }
    
    public function messages(): array
    {
        return [
            'name.required' => 'Nama wajib diisi.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah digunakan.',
            'divisi.required' => 'Divisi wajib diisi.',
            'divisi.exists' => 'Divisi tidak ditemukan.',
            'nik.max' => 'NIK maksimal 8 karakter.',
            'tgl_lahir.date' => 'Tanggal lahir tidak valid.',
            'tgl_masuk.date' => 'Tanggal masuk tidak valid.',
            'jenis_kelamin.in' => 'Jenis kelamin harus Laki-laki atau Perempuan.',
            'status.in' => 'Status harus Aktif atau Tidak Aktif.',
            'custom_gaji_pokok.min' => 'Gaji pokok minimal 0.',
            'custom_tunjangan.min' => 'Tunjangan minimal 0.',
            'password.required' => 'Password wajib diisi.',
            'password.confirmed' => 'Konfirmasi password tidak sesuai.',
        ];
    }
}
