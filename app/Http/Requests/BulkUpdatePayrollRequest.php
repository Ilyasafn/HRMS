<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BulkUpdatePayrollRequest extends FormRequest
{
    /**
     * Determine if the payroll is authorized to make this request.
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
            'payroll_ids' => 'required|array',
            'payroll_ids.*' => 'exists:payrolls,id',
        ];
    }
}
