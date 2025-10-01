<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Illuminate\Database\Eloquent\SoftDeletes;


class Cuti extends Model implements HasMedia
{
    use HasFactory;
    use SoftDeletes;

    use InteractsWithMedia;


    //protected $table = 'cutis';

    protected $fillable = [
        'user_id',
        'tgl_pengajuan',
        'tgl_mulai',
        'tgl_selesai',
        'jumlah_hari',
        'alasan',
        'jenis_cuti',
        'approved_by',
        'approved_at',
        'approval_status'
    ];
    

    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relationship ke user yang approve cuti
    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Register media conversions.
     */
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('preview')
            ->fit(Fit::Contain, 300, 300)
            ->nonQueued();
    }
}
