<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LontarPage extends Model
{
    protected $table = 'lontar_pages';

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return [
            'audio_verified' => 'boolean',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function lontar()
    {
        return $this->belongsTo(Lontar::class);
    }

    public function photoUrl(): ?string
    {
        return $this->foto_halaman ? route('uploads.show', ['filename' => basename($this->foto_halaman)]) : null;
    }

    public function enhancedUrl(): ?string
    {
        return $this->foto_enhanced ? route('uploads.show', ['filename' => basename($this->foto_enhanced)]) : null;
    }

    public function audioUrl(): ?string
    {
        return $this->audio_file ? route('uploads.show', ['filename' => basename($this->audio_file)]) : null;
    }
}
