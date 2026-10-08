@props(['title' => 'Admin', 'heading' => null, 'assets' => ['resources/js/admin.js'], 'active' => 'dashboard'])
<!DOCTYPE html>
<html lang="id">
<head>
    @include('partials.head', ['title' => $title.' · Admin', 'assets' => $assets])
    <meta name="robots" content="noindex,nofollow">
</head>
<body class="admin-shell">
    @include('partials.app-bar', ['admin' => true])
    @include('partials.flash')
    <div class="admin-body">
        <nav class="admin-nav" aria-label="Admin">
            <div style="padding:.25rem .9rem .75rem">
                <img src="{{ asset('images/logo/midas-horizontal-color.png') }}" alt="Rinjani-Lombok MIDAS" style="height:2.25rem;width:auto" class="dark:hidden">
                <img src="{{ asset('images/logo/midas-horizontal-white.png') }}" alt="Rinjani-Lombok MIDAS" style="height:2.25rem;width:auto" class="hidden dark:block">
            </div>
            @auth<div class="who">Masuk sebagai <b>{{ auth()->user()->displayName() }}</b></div>@endauth
            @php
                $links = [
                    'dashboard' => ['admin.dashboard', 'fa-gauge', 'Dashboard'],
                    'lontars' => ['admin.lontars.index', 'fa-book', 'Data naskah'],
                    'create' => ['admin.lontars.create', 'fa-plus', 'Tambah naskah'],
                    'readers' => ['admin.readers.index', 'fa-headphones', 'Pembaca'],
                    'categories' => ['admin.categories.index', 'fa-tags', 'Kategori'],
                ];
            @endphp
            @foreach($links as $key => [$route, $icon, $label])
                <a href="{{ route($route) }}" @if($active === $key) aria-current="page" @endif><i class="fas {{ $icon }}" aria-hidden="true" style="width:1.1rem;text-align:center"></i>{{ $label }}</a>
            @endforeach
            <div class="nav-sep"></div>
            <a href="{{ route('archive') }}" target="_blank" rel="noopener"><i class="fas fa-book-open" aria-hidden="true" style="width:1.1rem;text-align:center"></i>Lihat arsip</a>
            <a href="{{ route('logout') }}"><i class="fas fa-right-from-bracket" aria-hidden="true" style="width:1.1rem;text-align:center"></i>Logout</a>
        </nav>
        <main class="admin-main" id="main">
            <h1 class="r-h2" style="margin:0 0 1.25rem">{{ $heading ?? $title }}</h1>
            {{ $slot }}
        </main>
    </div>
</body>
</html>
