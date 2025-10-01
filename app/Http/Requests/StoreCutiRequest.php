<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCutiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => 'required|exists:users,id',
            'tgl_pengajuan' => 'nullable',
            'tgl_mulai' => 'nullable',  
            'tgl_selesai' => 'nullable',
            'jumlah_hari' => 'nullable|string|max:255',
            'alasan' => 'required|string|max:255',
            'jenis_cuti' => 'required|string|max:255',
            'approved_by' => 'nullable',
            'approved_at' => 'nullable',
            'approval_status' => 'nullable|string|max:255',
        ];
    }
}
