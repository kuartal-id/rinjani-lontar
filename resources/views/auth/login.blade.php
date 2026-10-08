<x-layouts.app title="Login admin" bodyClass="">
    <section class="page-head" style="border-bottom:0;min-height:calc(100vh - var(--bar-h));display:flex;align-items:center;justify-content:center;padding:2rem 1rem">
        <div class="panel login-card" style="padding:2rem">
            <img src="{{ asset('images/logo/midas-horizontal-color.png') }}" alt="Rinjani-Lombok MIDAS" style="height:2.75rem;width:auto;margin-bottom:1.25rem" class="dark:hidden">
            <img src="{{ asset('images/logo/midas-horizontal-white.png') }}" alt="Rinjani-Lombok MIDAS" style="height:2.75rem;width:auto;margin-bottom:1.25rem" class="hidden dark:block">
            <h1 class="r-h2" style="margin:0 0 .25rem">Login admin</h1>
            <p class="r-small" style="margin:0 0 1.5rem">Masuk untuk mengelola lokasi, foto, dan data peta.</p>

            <form method="POST" action="{{ route('login.store', request()->only('next')) }}" novalidate>
                @csrf
                <div style="margin-bottom:1rem">
                    <label class="label" for="username">Username atau email</label>
                    <input class="input" id="username" name="username" type="text" value="{{ old('username') }}" autocomplete="username" autofocus required>
                    @error('username')<p class="err">{{ $message }}</p>@enderror
                </div>
                <div style="margin-bottom:1.5rem">
                    <label class="label" for="password">Password</label>
                    <input class="input" id="password" name="password" type="password" autocomplete="current-password" required>
                    @error('password')<p class="err">{{ $message }}</p>@enderror
                </div>
                <button type="submit" class="r-btn" style="width:100%"><i class="fas fa-right-to-bracket" aria-hidden="true"></i> Masuk</button>
            </form>
            <p style="margin:1.25rem 0 0;text-align:center"><a href="{{ route('archive') }}" class="r-link">Kembali ke arsip</a></p>
        </div>
    </section>
</x-layouts.app>
