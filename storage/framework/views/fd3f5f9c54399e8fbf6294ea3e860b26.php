
<?php $attributes ??= new \Illuminate\View\ComponentAttributeBag;

$__newAttributes = [];
$__propNames = \Illuminate\View\ComponentAttributeBag::extractPropNames((['admin' => false]));

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

foreach (array_filter((['admin' => false]), 'is_string', ARRAY_FILTER_USE_KEY) as $__key => $__value) {
    $$__key = $$__key ?? $__value;
}

$__defined_vars = get_defined_vars();

foreach ($attributes->all() as $__key => $__value) {
    if (array_key_exists($__key, $__defined_vars)) unset($$__key);
}

unset($__defined_vars, $__key, $__value); ?>
<div class="app-bar">
    <div class="app-bar-inner">
        <nav aria-label="Rinjani-Lombok sites">
            <a href="<?php echo e(config('lontar.family.midas')); ?>">
                <span class="dot"></span><span class="hidden sm:inline">Rinjani-Lombok MIDAS</span><span class="sm:hidden">MIDAS</span>
            </a>
            <a href="<?php echo e(config('lontar.family.geopark')); ?>"><span class="dot"></span><span class="hidden sm:inline">Global Geopark</span><span class="sm:hidden">Geopark</span></a>
            <a href="<?php echo e(config('lontar.family.biosphere')); ?>"><span class="dot"></span><span class="hidden sm:inline">Biosphere Reserve</span><span class="sm:hidden">Biosphere</span></a>
        </nav>
        <div class="app-bar-tools">
            <a href="<?php echo e(config('lontar.family.map')); ?>" class="app-bar-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/></svg>
                <span data-i18n="familyMap">Peta MIDAS</span>
            </a>
            <a href="<?php echo e(route('archive')); ?>" class="app-bar-link" <?php if(! $admin): ?> aria-current="page" <?php endif; ?>>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15Z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/></svg>
                <span data-i18n="familyLontar">Arsip Lontar</span>
            </a>
            <div class="seg" role="group" aria-label="Bahasa / Language">
                <button type="button" data-lang-set="en" lang="en" aria-pressed="false">EN</button>
                <button type="button" data-lang-set="id" lang="id" aria-pressed="true">ID</button>
            </div>
            <button type="button" class="icon-btn" data-theme-toggle data-i18n-title="toggleTheme" title="Ganti tema terang/gelap" aria-label="Ganti tema terang/gelap">
                <svg class="i-moon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>
                <svg class="i-sun" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
            </button>
        </div>
    </div>
</div>
<?php /**PATH /root/.openclaw/workspace/rinjani-lontar/resources/views/partials/app-bar.blade.php ENDPATH**/ ?>