<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AudioRecording extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function lontarPage()
    {
        return $this->belongsTo(LontarPage::class);
    }

    public function reader()
    {
        return $this->belongsTo(Reader::class);
    }
}
