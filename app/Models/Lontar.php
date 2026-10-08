<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lontar extends Model
{
    protected $table = 'lontars';

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return ['is_sample' => 'boolean', 'created_at' => 'datetime', 'updated_at' => 'datetime'];
    }

    public function pages()
    {
        return $this->hasMany(LontarPage::class)->orderBy('nomor_lembar');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function coverUrl(): string
    {
        if ($this->foto_sampul) {
            return route('uploads.show', ['filename' => basename($this->foto_sampul)]);
        }

        return asset('static/images/placeholder.svg');
    }

    public function displayTitle(?string $locale = null): string
    {
        $locale ??= app()->getLocale();

        return ($locale === 'en' && $this->judul_en) ? $this->judul_en : $this->judul;
    }
}
