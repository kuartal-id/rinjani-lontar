<?php

namespace App\Console\Commands;

use App\Models\AdminUser;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

/**
 * Creates an admin or sets a new password. Needed once after the move from
 * Flask: its Werkzeug "scrypt" hashes cannot be verified by PHP.
 *
 *   php artisan lontar:admin admin                 (prompts for the password)
 *   php artisan lontar:admin admin --email=a@b.id  (create if missing)
 */
class SetAdminPassword extends Command
{
    protected $signature = 'lontar:admin {username=admin} {--email= : Email, required when creating} {--name= : Full name} {--password= : Password (prefer the prompt: this ends up in shell history)}';

    protected $description = 'Create an admin account or set a new password for it';

    public function handle(): int
    {
        $username = $this->argument('username');
        $user = AdminUser::where('username', $username)->first();

        if (! $user) {
            $email = $this->option('email') ?: $this->ask('Email');
            if (! filter_var($email, FILTER_VALIDATE_EMAIL) || AdminUser::where('email', $email)->exists()) {
                $this->error('A valid, unused email is required to create a new admin.');

                return self::FAILURE;
            }
            $user = new AdminUser([
                'username' => $username,
                'email' => $email,
                'nama_lengkap' => $this->option('name') ?: $username,
                'is_active' => true,
            ]);
        }

        $password = $this->option('password') ?: $this->secret('New password (min 10 characters)');
        if (strlen((string) $password) < 10) {
            $this->error('Password must be at least 10 characters.');

            return self::FAILURE;
        }

        $user->password_hash = Hash::make($password);
        $user->is_active = true;
        $user->save();

        $this->info("Password set for '{$user->username}'.");

        return self::SUCCESS;
    }
}
