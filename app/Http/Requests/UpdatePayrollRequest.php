<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePayrollRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => 'nullable',
            'periode' => 'nullable',
            'gaji_pokok' => 'nullable',
            'tunjangan' => 'nullable',
            'potongan' => 'nullable',
            'total_gaji' => 'nullable',
            'tanggal' => 'nullable',
            'status' => 'nullable|string|max:255',
            'approval_status' => 'nullable|string|max:255',
            'approved_by' => 'nullable',
            'approved_at' => 'nullable|string',
        ];
    }
}
