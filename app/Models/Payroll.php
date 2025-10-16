<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;



class Payroll extends Model 
{
    use HasFactory;
    
    

    //protected $table = 'payrolls';

    protected $fillable = [
        'user_id',
        'periode',
        'gaji_pokok',
        'tunjangan', 
        'potongan',
        'total_gaji',
        'total_hari_kerja',
        'total_kehadiran',
        'total_izin',
        'total_cuti',
        'total_alpha',
        'total_sakit',
        'tanggal',
        'status',
        'approval_status',
        'approved_by',
        'approved_at'
    ];

    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
    ];

    public function user(){
        return $this->belongsTo(User::class,'user_id');
    }

    public function approver(){
        return $this->belongsTo(User::class,'approved_by');
    }
    public function getPeriodeBulanAttribute()
    {
        return Carbon::parse($this->periode)->format('Y-m');
    }

    protected $appends = ['periode_bulan'];


}