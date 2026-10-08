<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Lontar Digital Archive schema — a family-style port of the interns' API data model
 * (kuartal-id/rinjani-lontar, backend/ on main): manuscripts (lontars), their leaves
 * (lontar_pages), readers and categories. The interns' separate images / audio /
 * version_history tables were folded into lontar_pages for the v1 port (each leaf
 * carries its photo, enhanced photo and audio directly).
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('admin_user')) {
            Schema::create('admin_user', function (Blueprint $t) {
                $t->increments('id');
                $t->string('username', 100)->unique();
                $t->string('email', 255)->unique();
                $t->string('password_hash', 255);
                $t->string('nama_lengkap', 255)->nullable();
                $t->boolean('is_active')->default(true);
                $t->dateTime('last_login')->nullable();
                $t->dateTime('created_at');
                $t->dateTime('updated_at');
            });
        }

        if (! Schema::hasTable('categories')) {
            Schema::create('categories', function (Blueprint $t) {
                $t->increments('id');
                $t->string('name', 150);
                $t->string('name_en', 150)->nullable();
                $t->text('description')->nullable();
                $t->text('description_en')->nullable();
                $t->dateTime('created_at');
                $t->dateTime('updated_at');
            });
        }

        if (! Schema::hasTable('readers')) {
            Schema::create('readers', function (Blueprint $t) {
                $t->increments('id');
                $t->string('nama', 150);
                $t->string('foto', 500)->nullable();
                $t->string('keahlian', 255)->nullable();
                $t->string('asal', 255)->nullable();
                $t->text('deskripsi')->nullable();
                $t->dateTime('created_at');
                $t->dateTime('updated_at');
            });
        }

        if (! Schema::hasTable('lontars')) {
            Schema::create('lontars', function (Blueprint $t) {
                $t->increments('id');
                $t->string('kode_naskah', 50)->nullable()->unique();
                $t->string('judul', 255);
                $t->string('judul_en', 255)->nullable();
                $t->string('slug', 255)->unique();
                $t->string('desa_asal', 255)->nullable();
                $t->string('perkiraan_tahun', 100)->nullable();
                $t->string('bahasa', 100)->nullable();
                $t->string('kondisi', 100)->nullable();
                $t->string('kategori', 150)->nullable();
                $t->unsignedInteger('category_id')->nullable()->index();
                $t->text('ringkasan')->nullable();
                $t->text('ringkasan_en')->nullable();
                $t->string('foto_sampul', 500)->nullable();
                $t->boolean('is_sample')->default(false);
                $t->dateTime('created_at');
                $t->dateTime('updated_at');
                $t->foreign('category_id')->references('id')->on('categories')->nullOnDelete();
            });
        }

        if (! Schema::hasTable('lontar_pages')) {
            Schema::create('lontar_pages', function (Blueprint $t) {
                $t->increments('id');
                $t->unsignedInteger('lontar_id')->index();
                $t->integer('nomor_lembar');
                $t->string('judul_halaman', 255)->nullable();
                $t->string('judul_halaman_en', 255)->nullable();
                $t->string('kondisi', 100)->nullable();
                $t->string('status_verifikasi', 50)->default('Belum diverifikasi');
                $t->text('ringkasan')->nullable();
                $t->text('penjelasan')->nullable();
                $t->text('penjelasan_en')->nullable();
                $t->text('catatan')->nullable();
                $t->string('foto_halaman', 500)->nullable();
                $t->string('foto_enhanced', 500)->nullable();
                $t->string('audio_file', 500)->nullable();
                $t->string('audio_tipe', 50)->nullable();
                $t->boolean('audio_verified')->default(false);
                $t->dateTime('created_at');
                $t->dateTime('updated_at');
                $t->foreign('lontar_id')->references('id')->on('lontars')->cascadeOnDelete()->cascadeOnUpdate();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('lontar_pages');
        Schema::dropIfExists('lontars');
        Schema::dropIfExists('readers');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('admin_user');
    }
};
