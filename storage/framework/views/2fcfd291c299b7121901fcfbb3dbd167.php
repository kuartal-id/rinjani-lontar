<?php if (isset($component)) { $__componentOriginalc8c9fd5d7827a77a31381de67195f0c3 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginalc8c9fd5d7827a77a31381de67195f0c3 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.layouts.admin','data' => ['title' => 'Dashboard']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('layouts.admin'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['title' => 'Dashboard']); ?>
    <div class="stat-grid">
        <div class="stat-card"><i class="fas fa-book" aria-hidden="true"></i><div><strong><?php echo e($lontarCount); ?></strong><span>Naskah</span></div></div>
        <div class="stat-card"><i class="fas fa-layer-group" aria-hidden="true"></i><div><strong><?php echo e($pageCount); ?></strong><span>Lembar</span></div></div>
        <div class="stat-card"><i class="fas fa-headphones" aria-hidden="true"></i><div><strong><?php echo e($readerCount); ?></strong><span>Pembaca</span></div></div>
        <div class="stat-card"><i class="fas fa-tags" aria-hidden="true"></i><div><strong><?php echo e($categoryCount); ?></strong><span>Kategori</span></div></div>
    </div>

    <section class="panel" style="margin-top:1.5rem">
        <div class="panel-head">
            <h2 class="r-h3" style="margin:0">Naskah terbaru</h2>
            <a class="r-btn-ghost r-btn-sm" href="<?php echo e(route('admin.lontars.index')); ?>">Kelola naskah</a>
        </div>
        <div class="table-wrap">
            <table class="a-table">
                <thead><tr><th>Judul</th><th>Kode</th><th>Kategori</th><th>Lembar</th><th></th></tr></thead>
                <tbody>
                    <?php $__empty_1 = true; $__currentLoopData = $recentLontars; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $lontar): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
                        <tr>
                            <td><strong><?php echo e($lontar->judul); ?></strong><?php if($lontar->is_sample): ?><span class="lontar-flag" style="position:static;margin-left:.4rem">Contoh</span><?php endif; ?></td>
                            <td class="mono"><?php echo e($lontar->kode_naskah ?: '-'); ?></td>
                            <td><?php echo e($lontar->kategori ?: '-'); ?></td>
                            <td><?php echo e($lontar->pages->count()); ?></td>
                            <td><a class="r-btn-ghost r-btn-sm" href="<?php echo e(route('admin.lontars.edit', $lontar)); ?>">Edit</a></td>
                        </tr>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
                        <tr><td colspan="5" class="hint">Belum ada naskah. <a class="r-link" href="<?php echo e(route('admin.lontars.create')); ?>">Tambah naskah pertama</a>.</td></tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </section>
 <?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginalc8c9fd5d7827a77a31381de67195f0c3)): ?>
<?php $attributes = $__attributesOriginalc8c9fd5d7827a77a31381de67195f0c3; ?>
<?php unset($__attributesOriginalc8c9fd5d7827a77a31381de67195f0c3); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalc8c9fd5d7827a77a31381de67195f0c3)): ?>
<?php $component = $__componentOriginalc8c9fd5d7827a77a31381de67195f0c3; ?>
<?php unset($__componentOriginalc8c9fd5d7827a77a31381de67195f0c3); ?>
<?php endif; ?>
<?php /**PATH /root/.openclaw/workspace/rinjani-lontar/resources/views/admin/dashboard.blade.php ENDPATH**/ ?>