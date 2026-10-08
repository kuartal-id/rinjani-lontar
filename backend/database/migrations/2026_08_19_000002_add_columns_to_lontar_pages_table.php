<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lontar_pages', function (Blueprint $table) {
            // Judul singkat halaman
            $table->string('judul_halaman')->nullable()->after('nomor_lembar');
            // Penjelasan isi halaman (lebih detail dari ringkasan)
            $table->text('penjelasan')->nullable()->after('ringkasan');
            // Catatan tambahan
            $table->text('catatan')->nullable()->after('penjelasan');
            // Foto lembar (gambar asli yang diupload)
            $table->string('foto_halaman')->nullable()->after('catatan');
            // Foto hasil peningkatan AI (untuk edge computing di masa depan)
            $table->string('foto_enhanced')->nullable()->after('foto_halaman');
            // Nama pembaca audio
            $table->string('nama_pembaca')->nullable()->after('foto_enhanced');
            // Path file audio pembacaan
            $table->string('audio_file')->nullable()->after('nama_pembaca');
            // Status verifikasi audio
            $table->boolean('audio_verified')->default(false)->after('audio_file');
            // Tipe audio: 'upload' atau 'rekam_langsung'
            $table->string('audio_tipe')->nullable()->after('audio_verified');
        });
    }

    public function down(): void
    {
        Schema::table('lontar_pages', function (Blueprint $table) {
            $table->dropColumn([
                'judul_halaman', 'penjelasan', 'catatan',
                'foto_halaman', 'foto_enhanced',
                'nama_pembaca', 'audio_file', 'audio_verified', 'audio_tipe'
            ]);
        });
    }
};
