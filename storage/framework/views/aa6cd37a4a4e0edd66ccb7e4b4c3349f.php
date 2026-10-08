<?php if (isset($component)) { $__componentOriginal5863877a5171c196453bfa0bd807e410 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal5863877a5171c196453bfa0bd807e410 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.layouts.app','data' => ['title' => 'Arsip Naskah Lontar','bodyClass' => 'archive-home']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('layouts.app'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['title' => 'Arsip Naskah Lontar','bodyClass' => 'archive-home']); ?>
    <section class="archive-hero">
        <div class="r-wrap-wide" style="padding-block:3.5rem 2.5rem">
            <p class="r-eyebrow" data-i18n="heroEyebrow">Warisan tulisan Lombok</p>
            <h1 class="r-h1" style="max-width:20ch" data-i18n="heroTitle">Lontar Digital Archive</h1>
            <p class="r-lead" style="max-width:56ch" data-i18n="heroLead">
                Naskah daun lontar masyarakat Lombok yang diarsipkan secara digital — teks, terjemahan,
                foto lembar, dan rekaman pembacaan dalam satu tempat.
            </p>
            <form method="GET" action="<?php echo e(route('archive')); ?>" class="archive-search" role="search">
                <input class="input" type="search" name="q" value="<?php echo e($search); ?>" placeholder="Cari judul, kode naskah, atau desa asal…" aria-label="Cari naskah">
                <button class="r-btn" type="submit"><i class="fas fa-magnifying-glass" aria-hidden="true"></i> <span data-i18n="searchBtn">Cari</span></button>
            </form>
        </div>
    </section>

    <div class="r-wrap-wide" style="padding-block:0 3rem">
        <nav class="chip-row" aria-label="Filter kategori">
            <a class="chip <?php if(! $activeCategory): ?> chip-active <?php endif; ?>" href="<?php echo e(route('archive', ['q' => $search])); ?>"><span data-i18n="allCategories">Semua</span> · <?php echo e($total); ?></a>
            <?php $__currentLoopData = $categories; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $c): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <a class="chip <?php if($activeCategory === $c): ?> chip-active <?php endif; ?>" href="<?php echo e(route('archive', ['q' => $search, 'kategori' => $c])); ?>"><?php echo e($c); ?></a>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </nav>

        <?php if($lontars->isEmpty()): ?>
            <div class="panel panel-body" style="text-align:center;padding:3rem 1rem">
                <p style="margin:0 0 .5rem"><i class="fas fa-book-open" style="font-size:1.5rem;opacity:.5" aria-hidden="true"></i></p>
                <p style="margin:0" data-i18n="emptyArchive">Belum ada naskah yang cocok.</p>
            </div>
        <?php else: ?>
            <div class="lontar-grid">
                <?php $__currentLoopData = $lontars; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $lontar): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <a class="lontar-card" href="<?php echo e(route('lontar.show', $lontar->slug)); ?>">
                        <span class="lontar-cover">
                            <img src="<?php echo e($lontar->coverUrl()); ?>" alt="" loading="lazy">
                            <?php if($lontar->is_sample): ?><span class="lontar-flag" data-i18n="sampleFlag">Contoh</span><?php endif; ?>
                        </span>
                        <span class="lontar-meta">
                            <?php if($lontar->kode_naskah): ?><span class="mono hint"><?php echo e($lontar->kode_naskah); ?></span><?php endif; ?>
                            <strong><?php echo e($lontar->displayTitle()); ?></strong>
                            <?php if($lontar->desa_asal || $lontar->perkiraan_tahun): ?>
                                <span class="hint"><?php echo e(collect([$lontar->desa_asal, $lontar->perkiraan_tahun])->filter()->implode(' · ')); ?></span>
                            <?php endif; ?>
                            <span class="hint"><?php echo e($lontar->pages_count); ?> <span data-i18n="leaves">lembar</span><?php if($lontar->kategori): ?> · <?php echo e($lontar->kategori); ?><?php endif; ?></span>
                        </span>
                    </a>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </div>
            <?php echo e($lontars->links()); ?>

        <?php endif; ?>
    </div>
 <?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal5863877a5171c196453bfa0bd807e410)): ?>
<?php $attributes = $__attributesOriginal5863877a5171c196453bfa0bd807e410; ?>
<?php unset($__attributesOriginal5863877a5171c196453bfa0bd807e410); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal5863877a5171c196453bfa0bd807e410)): ?>
<?php $component = $__componentOriginal5863877a5171c196453bfa0bd807e410; ?>
<?php unset($__componentOriginal5863877a5171c196453bfa0bd807e410); ?>
<?php endif; ?>
<?php /**PATH /root/.openclaw/workspace/rinjani-lontar/resources/views/home.blade.php ENDPATH**/ ?>