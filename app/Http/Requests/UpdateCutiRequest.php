<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCutiRequest extends FormRequest
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
            'alasan' => 'required|string|max:255',
            'jenis_cuti' => 'required|string|max:255',
            
        ];
    }
}
