@props(['title' => null, 'description' => null, 'assets' => [], 'bodyClass' => ''])
<!DOCTYPE html>
<html lang="id">
<head>
    @include('partials.head', ['title' => $title, 'description' => $description, 'assets' => $assets])
</head>
<body class="flex min-h-screen flex-col {{ $bodyClass }}">
    <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] r-btn">Lewati ke konten</a>
    @include('partials.app-bar')
    @include('partials.flash')
    <main id="main" class="flex-1">{{ $slot }}</main>
    @include('partials.footer')
</body>
</html>
