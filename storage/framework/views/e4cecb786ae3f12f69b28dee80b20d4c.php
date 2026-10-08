<?php if (isset($component)) { $__componentOriginal5863877a5171c196453bfa0bd807e410 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal5863877a5171c196453bfa0bd807e410 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.layouts.app','data' => ['title' => 'Login admin','bodyClass' => '']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('layouts.app'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['title' => 'Login admin','bodyClass' => '']); ?>
    <section class="page-head" style="border-bottom:0;min-height:calc(100vh - var(--bar-h));display:flex;align-items:center;justify-content:center;padding:2rem 1rem">
        <div class="panel login-card" style="padding:2rem">
            <img src="<?php echo e(asset('images/logo/midas-horizontal-color.png')); ?>" alt="Rinjani-Lombok MIDAS" style="height:2.75rem;width:auto;margin-bottom:1.25rem" class="dark:hidden">
            <img src="<?php echo e(asset('images/logo/midas-horizontal-white.png')); ?>" alt="Rinjani-Lombok MIDAS" style="height:2.75rem;width:auto;margin-bottom:1.25rem" class="hidden dark:block">
            <h1 class="r-h2" style="margin:0 0 .25rem">Login admin</h1>
            <p class="r-small" style="margin:0 0 1.5rem">Masuk untuk mengelola lokasi, foto, dan data peta.</p>

            <form method="POST" action="<?php echo e(route('login.store', request()->only('next'))); ?>" novalidate>
                <?php echo csrf_field(); ?>
                <div style="margin-bottom:1rem">
                    <label class="label" for="username">Username atau email</label>
                    <input class="input" id="username" name="username" type="text" value="<?php echo e(old('username')); ?>" autocomplete="username" autofocus required>
                    <?php $__errorArgs = ['username'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?><p class="err"><?php echo e($message); ?></p><?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
                </div>
                <div style="margin-bottom:1.5rem">
                    <label class="label" for="password">Password</label>
                    <input class="input" id="password" name="password" type="password" autocomplete="current-password" required>
                    <?php $__errorArgs = ['password'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?><p class="err"><?php echo e($message); ?></p><?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
                </div>
                <button type="submit" class="r-btn" style="width:100%"><i class="fas fa-right-to-bracket" aria-hidden="true"></i> Masuk</button>
            </form>
            <p style="margin:1.25rem 0 0;text-align:center"><a href="<?php echo e(route('archive')); ?>" class="r-link">Kembali ke arsip</a></p>
        </div>
    </section>
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
<?php /**PATH /root/.openclaw/workspace/rinjani-lontar/resources/views/auth/login.blade.php ENDPATH**/ ?>