<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAbsensiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => 'required|exists:users,id',
            'tanggal' => 'nullable',
            'jam_masuk' => 'nullable',
            'jam_keluar' => 'nullable',
            'status' => 'nullable|string|max:255',
            'keterangan' => 'nullable|string|max:255',
            'approval_status' => 'nullable|string|max:255',
            'approved_by' => 'nullable|exists:users,id',
            'approved_at' => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required' => 'User ID is required',
            'user_id.string' => 'User ID must be a string',
            'user_id.max' => 'User ID must not exceed 255 characters',
            'status.required' => 'Status is required',
            'status.string' => 'Status must be a string',
            'status.max' => 'Status must not exceed 255 characters',
            'keterangan.required' => 'Keterangan is required',
            'keterangan.string' => 'Keterangan must be a string',
            'keterangan.max' => 'Keterangan must not exceed 255 characters',
            'approval_status.required' => 'Approval Status is required',
            'approval_status.string' => 'Approval Status must be a string',
            'approval_status.max' => 'Approval Status must not exceed 255 characters',
            'approved_by.required' => 'Approved By is required',
            'approved_by.string' => 'Approved By must be a string',
            'approved_by.max' => 'Approved By must not exceed 255 characters',
            'approved_at.required' => 'Approved At is required',
            'approved_at.string' => 'Approved At must be a string',
            'approved_at.max' => 'Approved At must not exceed 255 characters',
        ];
    }
}
