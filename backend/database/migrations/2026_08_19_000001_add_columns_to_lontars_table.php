<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lontars', function (Blueprint $table) {
            // Kode unik naskah (e.g. LMB-001)
            $table->string('kode_naskah')->nullable()->unique()->after('id');
            // Foto sampul naskah
            $table->string('foto_sampul')->nullable()->after('ringkasan');
            // Bahasa naskah
            $table->string('bahasa')->nullable()->after('foto_sampul');
            // Kondisi fisik naskah
            $table->string('kondisi')->nullable()->after('bahasa');
            // Kategori (string, agar tidak bergantung pada tabel categories)
            $table->string('kategori')->nullable()->after('kondisi');
        });
    }

    public function down(): void
    {
        Schema::table('lontars', function (Blueprint $table) {
            $table->dropColumn(['kode_naskah', 'foto_sampul', 'bahasa', 'kondisi', 'kategori']);
        });
    }
};
