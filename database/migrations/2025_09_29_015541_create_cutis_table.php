<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cutis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->date('tgl_pengajuan')->nullable();
            $table->date('tgl_mulai')->nullable();
            $table->date('tgl_selesai')->nullable();
            $table->string('jumlah_hari')->nullable();
            $table->string('alasan',)->nullable();
            $table->enum('jenis_cuti',  [
                'Cuti Tahunan', 
                'Cuti Besar', 
                'Cuti Sakit', 
                'Cuti Melahirkan', 
                'Cuti Lainnya'
            ])->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->enum('approval_status', [ 
                'Pending', 
                'Approved', 
                'Rejected', 
                'Canceled'
            ])->nullable()->default('Pending');
            $table->softDeletes();
            $table->timestamps();

            // Index untuk performa
            $table->index('tgl_mulai');
            $table->index('tgl_selesai');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cutis');
    }
};
