<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Karyawan extends Model
{
    /** @use HasFactory<\Database\Factories\KaryawanFactory> */
    use HasFactory;

    protected $fillable = [
        'nama',
        'nik',
        'divisi_id',
        'jabatan_id',
        'alamat',
        'nomor_telepon',
        'tgl_masuk',
        'status',
    ];
}
