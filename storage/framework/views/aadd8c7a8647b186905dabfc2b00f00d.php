<?php if (isset($component)) { $__componentOriginal5863877a5171c196453bfa0bd807e410 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal5863877a5171c196453bfa0bd807e410 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.layouts.app','data' => ['title' => 'Tentang Arsip','bodyClass' => 'about-page']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('layouts.app'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['title' => 'Tentang Arsip','bodyClass' => 'about-page']); ?>
    <div class="r-wrap-wide r-prose" style="padding-block:2.5rem 3rem;max-width:62rem">
        <p class="r-eyebrow" data-i18n="aboutEyebrow">Arsip Lontar</p>
        <h1 class="r-h1" data-i18n="aboutTitle">Menjaga tulisan daun kelapa</h1>
        <p class="r-lead" data-i18n="aboutLead">
            Lontar adalah naskah tradisional yang ditulis di atas daun lontar (kelapa siwalan). Arsip ini
            mendigitalkan koleksi lontar masyarakat Lombok — setiap lembar difoto, diterjemahkan, dan
            dilengkapi rekaman pembacaan agar tetap hidup bagi generasi berikutnya.
        </p>

        <h2 class="r-h2" data-i18n="readersTitle">Para pembaca</h2>
        <p data-i18n="readersLead">Naskah lontar dibacakan oleh pembaca tradisional. Berikut para pembaca yang berkontribusi pada arsip ini.</p>
        <?php if($readers->isEmpty()): ?>
            <p class="hint" data-i18n="noReaders">Belum ada pembaca terdaftar.</p>
        <?php else: ?>
            <div class="reader-grid">
                <?php $__currentLoopData = $readers; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $reader): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <div class="reader-card">
                        <img src="<?php echo e($reader->photoUrl()); ?>" alt="<?php echo e($reader->nama); ?>">
                        <div>
                            <strong><?php echo e($reader->nama); ?></strong>
                            <?php if($reader->keahlian): ?><div class="hint"><?php echo e($reader->keahlian); ?></div><?php endif; ?>
                            <?php if($reader->asal): ?><div class="hint"><i class="fas fa-location-dot" aria-hidden="true"></i> <?php echo e($reader->asal); ?></div><?php endif; ?>
                            <?php if($reader->deskripsi): ?><p style="margin:.5rem 0 0"><?php echo e($reader->deskripsi); ?></p><?php endif; ?>
                        </div>
                    </div>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </div>
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
<?php /**PATH /root/.openclaw/workspace/rinjani-lontar/resources/views/about.blade.php ENDPATH**/ ?>