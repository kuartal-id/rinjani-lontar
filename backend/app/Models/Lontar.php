<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lontar extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode_naskah',
        'category_id',
        'judul',
        'desa_asal',
        'perkiraan_tahun',
        'ringkasan',
        'foto_sampul',
        'bahasa',
        'kondisi',
        'kategori',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function pages()
    {
        return $this->hasMany(LontarPage::class)->orderBy('nomor_lembar', 'asc');
    }
}
