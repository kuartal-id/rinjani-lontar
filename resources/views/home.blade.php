<x-layouts.app title="Arsip Naskah Lontar" bodyClass="archive-home">
    <section class="archive-hero">
        <div class="r-wrap-wide" style="padding-block:3.5rem 2.5rem">
            <p class="r-eyebrow" data-i18n="heroEyebrow">Warisan tulisan Lombok</p>
            <h1 class="r-h1" style="max-width:20ch" data-i18n="heroTitle">Lontar Digital Archive</h1>
            <p class="r-lead" style="max-width:56ch" data-i18n="heroLead">
                Naskah daun lontar masyarakat Lombok yang diarsipkan secara digital — teks, terjemahan,
                foto lembar, dan rekaman pembacaan dalam satu tempat.
            </p>
            <form method="GET" action="{{ route('archive') }}" class="archive-search" role="search">
                <input class="input" type="search" name="q" value="{{ $search }}" placeholder="Cari judul, kode naskah, atau desa asal…" aria-label="Cari naskah">
                <button class="r-btn" type="submit"><i class="fas fa-magnifying-glass" aria-hidden="true"></i> <span data-i18n="searchBtn">Cari</span></button>
            </form>
        </div>
    </section>

    <div class="r-wrap-wide" style="padding-block:0 3rem">
        <nav class="chip-row" aria-label="Filter kategori">
            <a class="chip @if(! $activeCategory) chip-active @endif" href="{{ route('archive', ['q' => $search]) }}"><span data-i18n="allCategories">Semua</span> · {{ $total }}</a>
            @foreach($categories as $c)
                <a class="chip @if($activeCategory === $c) chip-active @endif" href="{{ route('archive', ['q' => $search, 'kategori' => $c]) }}">{{ $c }}</a>
            @endforeach
        </nav>

        @if($lontars->isEmpty())
            <div class="panel panel-body" style="text-align:center;padding:3rem 1rem">
                <p style="margin:0 0 .5rem"><i class="fas fa-book-open" style="font-size:1.5rem;opacity:.5" aria-hidden="true"></i></p>
                <p style="margin:0" data-i18n="emptyArchive">Belum ada naskah yang cocok.</p>
            </div>
        @else
            <div class="lontar-grid">
                @foreach($lontars as $lontar)
                    <a class="lontar-card" href="{{ route('lontar.show', $lontar->slug) }}">
                        <span class="lontar-cover">
                            <img src="{{ $lontar->coverUrl() }}" alt="" loading="lazy">
                            @if($lontar->is_sample)<span class="lontar-flag" data-i18n="sampleFlag">Contoh</span>@endif
                        </span>
                        <span class="lontar-meta">
                            @if($lontar->kode_naskah)<span class="mono hint">{{ $lontar->kode_naskah }}</span>@endif
                            <strong>{{ $lontar->displayTitle() }}</strong>
                            @if($lontar->desa_asal || $lontar->perkiraan_tahun)
                                <span class="hint">{{ collect([$lontar->desa_asal, $lontar->perkiraan_tahun])->filter()->implode(' · ') }}</span>
                            @endif
                            <span class="hint">{{ $lontar->pages_count }} <span data-i18n="leaves">lembar</span>@if($lontar->kategori) · {{ $lontar->kategori }}@endif</span>
                        </span>
                    </a>
                @endforeach
            </div>
            {{ $lontars->links() }}
        @endif
    </div>
</x-layouts.app>
