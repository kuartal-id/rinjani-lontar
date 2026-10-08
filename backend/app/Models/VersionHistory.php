<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VersionHistory extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $table = 'version_history';

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
