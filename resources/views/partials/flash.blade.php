@php
    $icons = ['success' => 'fa-circle-check', 'danger' => 'fa-circle-exclamation', 'warning' => 'fa-triangle-exclamation', 'info' => 'fa-circle-info'];
@endphp
<div class="flash-stack" role="status" aria-live="polite">
    @foreach($icons as $type => $icon)
        @if(session($type))
            <div class="flash flash-{{ $type }}" data-flash>
                <i class="fas {{ $icon }}" aria-hidden="true" style="margin-top:.2rem"></i>
                <span>{{ session($type) }}</span>
                <button type="button" aria-label="Tutup"><i class="fas fa-xmark"></i></button>
            </div>
        @endif
    @endforeach
</div>
