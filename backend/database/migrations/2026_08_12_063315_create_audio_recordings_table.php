<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audio_recordings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lontar_page_id')->constrained('lontar_pages')->cascadeOnDelete();
            $table->foreignId('reader_id')->nullable()->constrained('readers')->nullOnDelete();
            $table->string('file_path');
            $table->string('tipe'); // rekam_langsung, upload
            $table->string('status_verifikasi')->default('Belum diverifikasi');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audio_recordings');
    }
};
