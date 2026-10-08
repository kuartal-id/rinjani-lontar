<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\AdminUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    public function show()
    {
        return view('auth.login');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'username' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string'],
        ], [
            'username.required' => 'Username atau email wajib diisi.',
            'password.required' => 'Password wajib diisi.',
        ]);

        $identifier = trim($data['username']);
        $user = AdminUser::where('username', $identifier)->orWhere('email', $identifier)->first();

        if ($user && ! $user->is_active) {
            return back()->withInput($request->only('username'))
                ->with('danger', 'Akun Anda telah dinonaktifkan. Hubungi administrator.');
        }

        if ($user && $user->hasLegacyHash()) {
            return back()->withInput($request->only('username'))
                ->with('danger', 'Password akun ini perlu diatur ulang setelah migrasi. Jalankan: php artisan lontar:admin '.$user->username);
        }

        if (! $user || ! Hash::check($data['password'], $user->password_hash)) {
            return back()->withInput($request->only('username'))
                ->with('danger', 'Username/email atau password salah.');
        }

        Auth::login($user);
        $request->session()->regenerate();
        $user->forceFill(['last_login' => now()])->saveQuietly();

        return redirect()->to($this->safeNext($request->query('next')))->with('success', 'Login berhasil. Selamat datang!');
    }

    public function destroy(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login')->with('info', 'Anda telah logout.');
    }

    /** Only same-site relative paths; anything else falls back to the dashboard. */
    private function safeNext(?string $next): string
    {
        if ($next && str_starts_with($next, '/') && ! str_starts_with($next, '//') && ! str_contains($next, '\\')) {
            return $next;
        }

        return route('admin.dashboard');
    }
}
