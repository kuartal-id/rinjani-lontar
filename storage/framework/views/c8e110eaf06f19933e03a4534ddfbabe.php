<?php if (isset($component)) { $__componentOriginal5863877a5171c196453bfa0bd807e410 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal5863877a5171c196453bfa0bd807e410 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.layouts.app','data' => ['title' => $lontar->displayTitle(),'description' => $lontar->ringkasan]] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('layouts.app'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['title' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($lontar->displayTitle()),'description' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($lontar->ringkasan)]); ?>
    <div class="r-wrap-wide" style="padding-block:2rem 3rem">
        <a class="r-link" href="<?php echo e(route('archive')); ?>" style="display:inline-flex;align-items:center;gap:.4rem;margin-bottom:1.25rem">
            <i class="fas fa-arrow-left" aria-hidden="true"></i> <span data-i18n="backToArchive">Kembali ke arsip</span>
        </a>

        <div class="detail-head">
            <img class="detail-cover" src="<?php echo e($lontar->coverUrl()); ?>" alt="<?php echo e($lontar->judul); ?>">
            <div>
                <?php if($lontar->kode_naskah): ?><p class="mono hint" style="margin:0 0 .35rem"><?php echo e($lontar->kode_naskah); ?></p><?php endif; ?>
                <h1 class="r-h1" style="margin:0 0 .35rem"><?php echo e($lontar->displayTitle()); ?></h1>
                <?php if($lontar->judul_en && $lontar->judul_en !== $lontar->judul): ?>
                    <p class="hint" style="margin:0 0 .75rem;font-size:1.05rem"><?php echo e($lontar->judul_en); ?></p>
                <?php endif; ?>
                <?php if($lontar->is_sample): ?><span class="lontar-flag" style="position:static" data-i18n="sampleFlag">Contoh</span><?php endif; ?>
                <dl class="fact-grid">
                    <?php if($lontar->desa_asal): ?><div><dt data-i18n="labelVillage">Desa asal</dt><dd><?php echo e($lontar->desa_asal); ?></dd></div><?php endif; ?>
                    <?php if($lontar->perkiraan_tahun): ?><div><dt data-i18n="labelYear">Perkiraan tahun</dt><dd><?php echo e($lontar->perkiraan_tahun); ?></dd></div><?php endif; ?>
                    <?php if($lontar->bahasa): ?><div><dt data-i18n="labelLanguage">Bahasa</dt><dd><?php echo e($lontar->bahasa); ?></dd></div><?php endif; ?>
                    <?php if($lontar->kondisi): ?><div><dt data-i18n="labelCondition">Kondisi</dt><dd><?php echo e($lontar->kondisi); ?></dd></div><?php endif; ?>
                    <?php if($lontar->kategori): ?><div><dt data-i18n="labelCategory">Kategori</dt><dd><?php echo e($lontar->kategori); ?></dd></div><?php endif; ?>
                    <div><dt data-i18n="labelLeaves">Jumlah lembar</dt><dd><?php echo e($lontar->pages->count()); ?></dd></div>
                </dl>
            </div>
        </div>

        <?php if($lontar->ringkasan): ?>
            <section class="panel" style="margin-top:1.75rem">
                <div class="panel-head"><h2 class="r-h3" style="margin:0" data-i18n="aboutManuscript">Tentang naskah ini</h2></div>
                <div class="panel-body r-prose">
                    <p lang="id"><?php echo e($lontar->ringkasan); ?></p>
                    <?php if($lontar->ringkasan_en): ?><p lang="en" class="hint"><?php echo e($lontar->ringkasan_en); ?></p><?php endif; ?>
                </div>
            </section>
        <?php endif; ?>

        <section style="margin-top:2rem">
            <h2 class="r-h2" data-i18n="leavesTitle">Lembar naskah</h2>
            <?php if($lontar->pages->isEmpty()): ?>
                <div class="panel panel-body hint" data-i18n="noLeaves">Lembar belum diunggah.</div>
            <?php else: ?>
                <div class="viewer" data-leaf-viewer>
                    <div class="viewer-stage">
                        <?php $__currentLoopData = $lontar->pages; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $i => $page): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <figure class="viewer-leaf <?php if($i === 0): ?> viewer-leaf-active <?php endif; ?>" data-leaf="<?php echo e($i); ?>">
                                <?php if($page->enhancedUrl() ?? $page->photoUrl()): ?>
                                    <img src="<?php echo e($page->enhancedUrl() ?? $page->photoUrl()); ?>" alt="<?php echo e($page->judul_halaman ?: 'Lembar '.$page->nomor_lembar); ?>">
                                <?php else: ?>
                                    <div class="viewer-empty hint"><i class="fas fa-image" aria-hidden="true"></i><br><span data-i18n="noScan">Pindaian belum tersedia</span></div>
                                <?php endif; ?>
                                <figcaption>
                                    <strong><?php echo e($page->judul_halaman ?: __('Lembar :n', ['n' => $page->nomor_lembar])); ?></strong>
                                    <?php if($page->judul_halaman_en): ?><span class="hint"> · <?php echo e($page->judul_halaman_en); ?></span><?php endif; ?>
                                    <span class="hint"> · <?php echo e($page->status_verifikasi); ?></span>
                                </figcaption>
                            </figure>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                        <button type="button" class="viewer-nav viewer-prev" data-leaf-prev aria-label="Lembar sebelumnya"><i class="fas fa-chevron-left" aria-hidden="true"></i></button>
                        <button type="button" class="viewer-nav viewer-next" data-leaf-next aria-label="Lembar berikutnya"><i class="fas fa-chevron-right" aria-hidden="true"></i></button>
                    </div>
                    <div class="viewer-strip" role="tablist" aria-label="Daftar lembar">
                        <?php $__currentLoopData = $lontar->pages; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $i => $page): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <button type="button" role="tab" class="viewer-thumb <?php if($i === 0): ?> viewer-thumb-active <?php endif; ?>" data-leaf-goto="<?php echo e($i); ?>" aria-selected="<?php echo e($i === 0 ? 'true' : 'false'); ?>">
                                <?php if($page->photoUrl()): ?>
                                    <img src="<?php echo e($page->photoUrl()); ?>" alt="" loading="lazy">
                                <?php else: ?>
                                    <span class="viewer-thumb-num mono"><?php echo e($page->nomor_lembar); ?></span>
                                <?php endif; ?>
                                <span class="viewer-thumb-label"><?php echo e($page->nomor_lembar); ?></span>
                            </button>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </div>
                    <div class="viewer-text">
                        <?php $__currentLoopData = $lontar->pages; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $i => $page): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <article class="viewer-page-text <?php if($i === 0): ?> viewer-page-text-active <?php endif; ?>" data-leaf-text="<?php echo e($i); ?>">
                                <?php if($page->penjelasan): ?><p lang="id"><?php echo e($page->penjelasan); ?></p><?php endif; ?>
                                <?php if($page->penjelasan_en): ?><p lang="en" class="hint"><?php echo e($page->penjelasan_en); ?></p><?php endif; ?>
                                <?php if($page->ringkasan): ?><p class="hint"><?php echo e($page->ringkasan); ?></p><?php endif; ?>
                                <?php if($page->catatan): ?><p class="hint"><em><?php echo e($page->catatan); ?></em></p><?php endif; ?>
                                <?php if($page->audioUrl()): ?>
                                    <audio controls preload="none" src="<?php echo e($page->audioUrl()); ?>" style="width:100%;margin-top:.75rem"></audio>
                                    <?php if($page->audio_verified): ?><span class="hint" style="display:inline-flex;align-items:center;gap:.3rem;margin-top:.35rem"><i class="fas fa-circle-check" aria-hidden="true"></i> <span data-i18n="audioVerified">Rekaman terverifikasi</span></span><?php endif; ?>
                                <?php endif; ?>
                            </article>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </div>
                </div>
            <?php endif; ?>
        </section>
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
<?php /**PATH /root/.openclaw/workspace/rinjani-lontar/resources/views/detail.blade.php ENDPATH**/ ?>