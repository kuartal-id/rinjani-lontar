@props(['title' => null, 'description' => null, 'assets' => []])
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>{{ $title ? $title.' | ' : '' }}{{ config('lontar.name') }}</title>
<meta name="description" content="{{ $description ?? 'Arsip digital naskah lontar Lombok: jelajahi koleksi manuskrip daun lontar, terjemahan, dan rekaman pembacaan.' }}">
<meta name="theme-color" content="#3c6a9d">
<meta property="og:type" content="website">
<meta property="og:site_name" content="{{ config('lontar.name') }}">
<meta property="og:title" content="{{ $title ?? config('lontar.name') }}">
<meta property="og:description" content="{{ $description ?? 'Arsip digital naskah lontar Lombok.' }}">
<link rel="icon" href="{{ asset('favicon.ico') }}" sizes="any">
<link rel="icon" type="image/png" sizes="512x512" href="{{ asset('favicon-512.png') }}">
<link rel="apple-touch-icon" href="{{ asset('apple-touch-icon.png') }}">
<script>
    (function () {
        try {
            var stored = localStorage.getItem('rinjani-theme');
            var dark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (dark) document.documentElement.classList.add('dark');
        } catch (e) {}
        try { document.documentElement.lang = localStorage.getItem('geo_lang') === 'en' ? 'en' : 'id'; } catch (e) {}
    })();
</script>
@vite(array_merge(['resources/css/app.css', 'resources/js/app.js'], $assets))
