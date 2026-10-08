<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lontar_pages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lontar_id')->constrained('lontars')->cascadeOnDelete();
            $table->integer('nomor_lembar');
            $table->string('kondisi')->nullable(); // Baik, Rusak, Perlu Perawatan
            $table->text('ringkasan')->nullable();
            $table->string('status_verifikasi')->default('Belum diverifikasi'); // Belum diverifikasi, Dalam pemeriksaan, Terverifikasi
            $table->string('url_qr_code')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lontar_pages');
    }
};
