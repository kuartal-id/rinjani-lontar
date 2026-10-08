<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LontarPage extends Model
{
    use HasFactory;

    protected $fillable = [
        'lontar_id',
        'nomor_lembar',
        'judul_halaman',
        'kondisi',
        'ringkasan',
        'penjelasan',
        'catatan',
        'foto_halaman',
        'foto_enhanced',
        'nama_pembaca',
        'audio_file',
        'audio_verified',
        'audio_tipe',
        'status_verifikasi',
        'url_qr_code',
    ];

    protected $casts = [
        'audio_verified' => 'boolean',
        'nomor_lembar' => 'integer',
    ];

    public function lontar()
    {
        return $this->belongsTo(Lontar::class);
    }

    public function images()
    {
        return $this->hasMany(Image::class);
    }

    public function audioRecordings()
    {
        return $this->hasMany(AudioRecording::class);
    }
}
