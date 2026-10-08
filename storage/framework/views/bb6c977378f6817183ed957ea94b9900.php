<?php $attributes ??= new \Illuminate\View\ComponentAttributeBag;

$__newAttributes = [];
$__propNames = \Illuminate\View\ComponentAttributeBag::extractPropNames((['title' => 'Admin', 'heading' => null, 'assets' => ['resources/js/admin.js'], 'active' => 'dashboard']));

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

foreach (array_filter((['title' => 'Admin', 'heading' => null, 'assets' => ['resources/js/admin.js'], 'active' => 'dashboard']), 'is_string', ARRAY_FILTER_USE_KEY) as $__key => $__value) {
    $$__key = $$__key ?? $__value;
}

$__defined_vars = get_defined_vars();

foreach ($attributes->all() as $__key => $__value) {
    if (array_key_exists($__key, $__defined_vars)) unset($$__key);
}

unset($__defined_vars, $__key, $__value); ?>
<!DOCTYPE html>
<html lang="id">
<head>
    <?php echo $__env->make('partials.head', ['title' => $title.' · Admin', 'assets' => $assets], array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
    <meta name="robots" content="noindex,nofollow">
</head>
<body class="admin-shell">
    <?php echo $__env->make('partials.app-bar', ['admin' => true], array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
    <?php echo $__env->make('partials.flash', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
    <div class="admin-body">
        <nav class="admin-nav" aria-label="Admin">
            <div style="padding:.25rem .9rem .75rem">
                <img src="<?php echo e(asset('images/logo/midas-horizontal-color.png')); ?>" alt="Rinjani-Lombok MIDAS" style="height:2.25rem;width:auto" class="dark:hidden">
                <img src="<?php echo e(asset('images/logo/midas-horizontal-white.png')); ?>" alt="Rinjani-Lombok MIDAS" style="height:2.25rem;width:auto" class="hidden dark:block">
            </div>
            <?php if(auth()->guard()->check()): ?><div class="who">Masuk sebagai <b><?php echo e(auth()->user()->displayName()); ?></b></div><?php endif; ?>
            <?php
                $links = [
                    'dashboard' => ['admin.dashboard', 'fa-gauge', 'Dashboard'],
                    'lontars' => ['admin.lontars.index', 'fa-book', 'Data naskah'],
                    'create' => ['admin.lontars.create', 'fa-plus', 'Tambah naskah'],
                    'readers' => ['admin.readers.index', 'fa-headphones', 'Pembaca'],
                    'categories' => ['admin.categories.index', 'fa-tags', 'Kategori'],
                ];
            ?>
            <?php $__currentLoopData = $links; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key => [$route, $icon, $label]): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <a href="<?php echo e(route($route)); ?>" <?php if($active === $key): ?> aria-current="page" <?php endif; ?>><i class="fas <?php echo e($icon); ?>" aria-hidden="true" style="width:1.1rem;text-align:center"></i><?php echo e($label); ?></a>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            <div class="nav-sep"></div>
            <a href="<?php echo e(route('archive')); ?>" target="_blank" rel="noopener"><i class="fas fa-book-open" aria-hidden="true" style="width:1.1rem;text-align:center"></i>Lihat arsip</a>
            <a href="<?php echo e(route('logout')); ?>"><i class="fas fa-right-from-bracket" aria-hidden="true" style="width:1.1rem;text-align:center"></i>Logout</a>
        </nav>
        <main class="admin-main" id="main">
            <h1 class="r-h2" style="margin:0 0 1.25rem"><?php echo e($heading ?? $title); ?></h1>
            <?php echo e($slot); ?>

        </main>
    </div>
</body>
</html>
<?php /**PATH /root/.openclaw/workspace/rinjani-lontar/resources/views/components/layouts/admin.blade.php ENDPATH**/ ?>