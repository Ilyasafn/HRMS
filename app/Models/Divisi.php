<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Divisi extends Model
{
    /** @use HasFactory<\Database\Factories\DivisiFactory> */
    use HasFactory;

    protected $fillable = [
        'nama',
        'keterangan',
    ];

    public function users() {
        return $this->hasMany(User::class);
    }
}
