<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clean up previous test admin accounts
        User::whereIn('email', ['admin@rinjanigeopark.com', 'admin@gmail.com', 'adminweblontar@gmail.com', 'Adminweblontar'])->delete();

        User::create([
            'name' => 'Adminweblontar',
            'email' => 'adminweblontar@gmail.com',
            'password' => Hash::make('admin'),
            'email_verified_at' => now(),
        ]);
    }
}
