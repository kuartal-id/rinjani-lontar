<?php $attributes ??= new \Illuminate\View\ComponentAttributeBag;

$__newAttributes = [];
$__propNames = \Illuminate\View\ComponentAttributeBag::extractPropNames((['title' => null, 'description' => null, 'assets' => []]));

foreach ($attributes->all() as $__key => $__value) {
    if (in_array($__key, $__propNames)) {
        $$__key = $$__key ?? $__value;
    } else {
        $__newAttributes[$__key] = $__value;
    }
}

$attributes = new \Illuminate\View\ComponentAttributeBag($__newAttributes);

unset($__propNames);
unset($__newAttributes);

foreach (array_filter((['title' => null, 'description' => null, 'assets' => []]), 'is_string', ARRAY_FILTER_USE_KEY) as $__key => $__value) {
    $$__key = $$__key ?? $__value;
}

$__defined_vars = get_defined_vars();

foreach ($attributes->all() as $__key => $__value) {
    if (array_key_exists($__key, $__defined_vars)) unset($$__key);
}

unset($__defined_vars, $__key, $__value); ?>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title><?php echo e($title ? $title.' | ' : ''); ?><?php echo e(config('lontar.name')); ?></title>
<meta name="description" content="<?php echo e($description ?? 'Arsip digital naskah lontar Lombok: jelajahi koleksi manuskrip daun lontar, terjemahan, dan rekaman pembacaan.'); ?>">
<meta name="theme-color" content="#3c6a9d">
<meta property="og:type" content="website">
<meta property="og:site_name" content="<?php echo e(config('lontar.name')); ?>">
<meta property="og:title" content="<?php echo e($title ?? config('lontar.name')); ?>">
<meta property="og:description" content="<?php echo e($description ?? 'Arsip digital naskah lontar Lombok.'); ?>">
<link rel="icon" href="<?php echo e(asset('favicon.ico')); ?>" sizes="any">
<link rel="icon" type="image/png" sizes="512x512" href="<?php echo e(asset('favicon-512.png')); ?>">
<link rel="apple-touch-icon" href="<?php echo e(asset('apple-touch-icon.png')); ?>">
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
<?php echo app('Illuminate\Foundation\Vite')(array_merge(['resources/css/app.css', 'resources/js/app.js'], $assets)); ?>
<?php /**PATH /root/.openclaw/workspace/rinjani-lontar/resources/views/partials/head.blade.php ENDPATH**/ ?>