<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

/**
 * Admin account. Same table as the Flask app (`admin_user`, password in
 * `password_hash`). Hashes created by Flask (Werkzeug "scrypt:...") cannot be
 * verified by PHP: run `php artisan rinjani:admin <username>` to set a new
 * bcrypt password.
 */
class AdminUser extends Authenticatable
{
    protected $table = 'admin_user';

    protected $guarded = ['id'];

    protected $hidden = ['password_hash'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'last_login' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function getAuthPassword(): string
    {
        return (string) $this->password_hash;
    }

    /** The legacy table has no remember_token column; the session lifetime covers "stay signed in". */
    public function getRememberTokenName(): string
    {
        return '';
    }

    public function hasLegacyHash(): bool
    {
        return ! str_starts_with((string) $this->password_hash, '$2y$');
    }

    public function displayName(): string
    {
        return $this->nama_lengkap ?: $this->username;
    }
}
