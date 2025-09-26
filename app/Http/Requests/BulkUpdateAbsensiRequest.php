<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BulkUpdateAbsensiRequest extends FormRequest
{
    /**
     * Determine if the absensi is authorized to make this request.
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
            'absensi_ids' => 'required|array',
            'absensi_ids.*' => 'exists:absensis,id',
        ];
    }
}
