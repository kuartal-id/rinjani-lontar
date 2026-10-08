<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('version_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('tabel_referensi');
            $table->unsignedBigInteger('id_referensi');
            $table->text('data_sebelum')->nullable();
            $table->text('data_sesudah')->nullable();
            $table->integer('versi');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('version_history');
    }
};
