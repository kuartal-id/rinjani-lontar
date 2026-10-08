{{-- The Rinjani-Lombok family bar, as on rinjanilombok.org: family sites + MIDAS Map + this archive. --}}
@props(['admin' => false])
<div class="app-bar">
    <div class="app-bar-inner">
        <nav aria-label="Rinjani-Lombok sites">
            <a href="{{ config('lontar.family.midas') }}">
                <span class="dot"></span><span class="hidden sm:inline">Rinjani-Lombok MIDAS</span><span class="sm:hidden">MIDAS</span>
            </a>
            <a href="{{ config('lontar.family.geopark') }}"><span class="dot"></span><span class="hidden sm:inline">Global Geopark</span><span class="sm:hidden">Geopark</span></a>
            <a href="{{ config('lontar.family.biosphere') }}"><span class="dot"></span><span class="hidden sm:inline">Biosphere Reserve</span><span class="sm:hidden">Biosphere</span></a>
        </nav>
        <div class="app-bar-tools">
            <a href="{{ config('lontar.family.map') }}" class="app-bar-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/></svg>
                <span data-i18n="familyMap">Peta MIDAS</span>
            </a>
            <a href="{{ route('archive') }}" class="app-bar-link" @if(! $admin) aria-current="page" @endif>
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
