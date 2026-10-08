<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reader extends Model
{
    protected $table = 'readers';

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return ['created_at' => 'datetime', 'updated_at' => 'datetime'];
    }

    public function photoUrl(): string
    {
        return $this->foto
            ? route('uploads.show', ['filename' => basename($this->foto)])
            : asset('static/images/placeholder.svg');
    }
}
