<?php
    $icons = ['success' => 'fa-circle-check', 'danger' => 'fa-circle-exclamation', 'warning' => 'fa-triangle-exclamation', 'info' => 'fa-circle-info'];
?>
<div class="flash-stack" role="status" aria-live="polite">
    <?php $__currentLoopData = $icons; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $type => $icon): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <?php if(session($type)): ?>
            <div class="flash flash-<?php echo e($type); ?>" data-flash>
                <i class="fas <?php echo e($icon); ?>" aria-hidden="true" style="margin-top:.2rem"></i>
                <span><?php echo e(session($type)); ?></span>
                <button type="button" aria-label="Tutup"><i class="fas fa-xmark"></i></button>
            </div>
        <?php endif; ?>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
</div>
<?php /**PATH /root/.openclaw/workspace/rinjani-lontar/resources/views/partials/flash.blade.php ENDPATH**/ ?>