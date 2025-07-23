<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreJabatanRequest extends FormRequest
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
        ];
    }

    public function messages(): array{
        return [
            'nama.required' => 'Nama jabatan harus diisi.',
            'nama.string' => 'Nama jabatan harus berupa teks.',
            'nama.max' => 'Nama jabatan tidak boleh lebih dari 255 karakter.',
        ];
    }
}
