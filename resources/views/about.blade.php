<x-layouts.app title="Tentang Arsip" bodyClass="about-page">
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
        @if($readers->isEmpty())
            <p class="hint" data-i18n="noReaders">Belum ada pembaca terdaftar.</p>
        @else
            <div class="reader-grid">
                @foreach($readers as $reader)
                    <div class="reader-card">
                        <img src="{{ $reader->photoUrl() }}" alt="{{ $reader->nama }}">
                        <div>
                            <strong>{{ $reader->nama }}</strong>
                            @if($reader->keahlian)<div class="hint">{{ $reader->keahlian }}</div>@endif
                            @if($reader->asal)<div class="hint"><i class="fas fa-location-dot" aria-hidden="true"></i> {{ $reader->asal }}</div>@endif
                            @if($reader->deskripsi)<p style="margin:.5rem 0 0">{{ $reader->deskripsi }}</p>@endif
                        </div>
                    </div>
                @endforeach
            </div>
        @endif
    </div>
</x-layouts.app>
