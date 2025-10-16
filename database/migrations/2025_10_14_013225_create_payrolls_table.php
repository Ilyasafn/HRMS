<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payrolls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('periode', 7);
            $table->decimal('gaji_pokok', 15,2);
            $table->decimal('tunjangan', 15,2);
            $table->decimal('potongan', 15,2)->default(0);
            $table->decimal('total_gaji', 15,2);
            $table->date('tanggal');
            $table->enum('status', ['Draft', 'Finalized'])->default('Draft')->nullable();

            $table->enum('approval_status', ['Pending', 'Approved', 'Rejected'])->default('Pending')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->datetime('approved_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payrolls');
    }
};
