<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreKaryawanRequest extends FormRequest
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
            'nama' => 'required|string|max:255',
            'nik' => 'required|string|max:8',
            'divisi_id' => 'required|exists:divisis,id',
            'jabatan_id' => 'required|exists:jabatans,id',
            'alamat' => 'nullable|string|max:255',
            'nomor_telepon' => 'required|string|max:20',
            'tgl_masuk' => 'nullable|date',
            'status' => 'required|in:Aktif,Tidak Aktif',
        ];
    }

    public function messages(): array
    {
        return [
            'nama.required' => 'Nama karyawan harus diisi.',
            'nik.required' => 'NIK harus diisi.',
            'divisi_id' => 'Divisi harus dipilih.',
            'jabatan_id' => 'Jabatan harus dipilih.',
            'alamat.required' => 'Alamat harus diisi.',
            'nomor_telepon.required' => 'Nomor telepon harus diisi.',
            'tgl_masuk.required' => 'Tanggal masuk harus diisi.',
            'status.required' => 'Status harus dipilih.',
        ];
    }
}
