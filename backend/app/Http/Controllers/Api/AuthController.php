<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Handle Admin Login and issue Sanctum token.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|string',
            'password' => 'required|string',
        ], [
            'email.required'    => 'Email atau username wajib diisi.',
            'password.required' => 'Password wajib diisi.',
        ]);

        $loginInput = $request->input('email');
        $password = $request->input('password');

        // Check user by email or name (case-insensitive for both username and email)
        $cleanInput = strtolower(trim($loginInput));
        $user = User::whereRaw('LOWER(email) = ?', [$cleanInput])
            ->orWhereRaw('LOWER(name) = ?', [$cleanInput])
            ->first();

        if (!$user || !Hash::check($password, $user->password)) {
            return response()->json([
                'message' => 'Email/Username atau password yang Anda masukkan salah.',
                'errors' => [
                    'credentials' => ['Email/Username atau password yang Anda masukkan salah.']
                ]
            ], 401);
        }

        // Revoke existing admin tokens if needed or issue a fresh one
        $token = $user->createToken('admin_auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil. Selamat datang kembali, ' . $user->name . '!',
            'user' => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
            ],
            'token' => $token,
        ], 200);
    }

    /**
     * Get authenticated user profile.
     */
    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'user' => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
            ],
        ], 200);
    }

    /**
     * Logout admin and revoke current access token.
     */
    public function logout(Request $request)
    {
        $user = $request->user();

        if ($user) {
            // Delete current access token
            $user->currentAccessToken()->delete();
        }

        return response()->json([
            'message' => 'Anda telah berhasil keluar (logout).',
        ], 200);
    }

    /**
     * Update admin account profile (username, email) and/or password.
     */
    public function updateAccount(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Sesi autentikasi tidak valid atau telah berakhir.'
            ], 401);
        }

        $rules = [
            'name'             => 'required|string|max:255',
            'email'            => 'required|string|max:255|unique:users,email,' . $user->id,
            'current_password' => 'nullable|string',
            'password'         => 'nullable|string|min:4|confirmed',
        ];

        // Jika ingin mengganti password baru, wajibkan input password saat ini
        if ($request->filled('password')) {
            $rules['current_password'] = 'required|string';
        }

        $messages = [
            'name.required'             => 'Nama/Username akun wajib diisi.',
            'email.required'            => 'Email akun wajib diisi.',
            'email.unique'              => 'Email tersebut sudah digunakan oleh akun lain.',
            'current_password.required' => 'Password saat ini wajib diisi jika ingin mengganti password.',
            'password.min'              => 'Password baru minimal berisi 4 karakter.',
            'password.confirmed'        => 'Konfirmasi password baru tidak sesuai.',
        ];

        $validated = $request->validate($rules, $messages);

        // Verifikasi password saat ini jika ada perubahan password
        if ($request->filled('password')) {
            if (!Hash::check($request->input('current_password'), $user->password)) {
                return response()->json([
                    'message' => 'Password saat ini yang Anda masukkan tidak sesuai.',
                    'errors' => [
                        'current_password' => ['Password saat ini salah. Silakan coba kembali.']
                    ]
                ], 422);
            }

            $user->password = Hash::make($request->input('password'));
        }

        $user->name = trim($validated['name']);
        $user->email = trim($validated['email']);
        $user->save();

        return response()->json([
            'message' => 'Pengaturan akun admin berhasil diperbarui!',
            'user' => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
            ],
        ], 200);
    }
}

