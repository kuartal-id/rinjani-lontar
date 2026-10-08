<x-layouts.app :title="$lontar->displayTitle()" :description="$lontar->ringkasan">
    <div class="r-wrap-wide" style="padding-block:2rem 3rem">
        <a class="r-link" href="{{ route('archive') }}" style="display:inline-flex;align-items:center;gap:.4rem;margin-bottom:1.25rem">
            <i class="fas fa-arrow-left" aria-hidden="true"></i> <span data-i18n="backToArchive">Kembali ke arsip</span>
        </a>

        <div class="detail-head">
            <img class="detail-cover" src="{{ $lontar->coverUrl() }}" alt="{{ $lontar->judul }}">
            <div>
                @if($lontar->kode_naskah)<p class="mono hint" style="margin:0 0 .35rem">{{ $lontar->kode_naskah }}</p>@endif
                <h1 class="r-h1" style="margin:0 0 .35rem">{{ $lontar->displayTitle() }}</h1>
                @if($lontar->judul_en && $lontar->judul_en !== $lontar->judul)
                    <p class="hint" style="margin:0 0 .75rem;font-size:1.05rem">{{ $lontar->judul_en }}</p>
                @endif
                @if($lontar->is_sample)<span class="lontar-flag" style="position:static" data-i18n="sampleFlag">Contoh</span>@endif
                <dl class="fact-grid">
                    @if($lontar->desa_asal)<div><dt data-i18n="labelVillage">Desa asal</dt><dd>{{ $lontar->desa_asal }}</dd></div>@endif
                    @if($lontar->perkiraan_tahun)<div><dt data-i18n="labelYear">Perkiraan tahun</dt><dd>{{ $lontar->perkiraan_tahun }}</dd></div>@endif
                    @if($lontar->bahasa)<div><dt data-i18n="labelLanguage">Bahasa</dt><dd>{{ $lontar->bahasa }}</dd></div>@endif
                    @if($lontar->kondisi)<div><dt data-i18n="labelCondition">Kondisi</dt><dd>{{ $lontar->kondisi }}</dd></div>@endif
                    @if($lontar->kategori)<div><dt data-i18n="labelCategory">Kategori</dt><dd>{{ $lontar->kategori }}</dd></div>@endif
                    <div><dt data-i18n="labelLeaves">Jumlah lembar</dt><dd>{{ $lontar->pages->count() }}</dd></div>
                </dl>
            </div>
        </div>

        @if($lontar->ringkasan)
            <section class="panel" style="margin-top:1.75rem">
                <div class="panel-head"><h2 class="r-h3" style="margin:0" data-i18n="aboutManuscript">Tentang naskah ini</h2></div>
                <div class="panel-body r-prose">
                    <p lang="id">{{ $lontar->ringkasan }}</p>
                    @if($lontar->ringkasan_en)<p lang="en" class="hint">{{ $lontar->ringkasan_en }}</p>@endif
                </div>
            </section>
        @endif

        <section style="margin-top:2rem">
            <h2 class="r-h2" data-i18n="leavesTitle">Lembar naskah</h2>
            @if($lontar->pages->isEmpty())
                <div class="panel panel-body hint" data-i18n="noLeaves">Lembar belum diunggah.</div>
            @else
                <div class="viewer" data-leaf-viewer>
                    <div class="viewer-stage">
                        @foreach($lontar->pages as $i => $page)
                            <figure class="viewer-leaf @if($i === 0) viewer-leaf-active @endif" data-leaf="{{ $i }}">
                                @if($page->enhancedUrl() ?? $page->photoUrl())
                                    <img src="{{ $page->enhancedUrl() ?? $page->photoUrl() }}" alt="{{ $page->judul_halaman ?: 'Lembar '.$page->nomor_lembar }}">
                                @else
                                    <div class="viewer-empty hint"><i class="fas fa-image" aria-hidden="true"></i><br><span data-i18n="noScan">Pindaian belum tersedia</span></div>
                                @endif
                                <figcaption>
                                    <strong>{{ $page->judul_halaman ?: __('Lembar :n', ['n' => $page->nomor_lembar]) }}</strong>
                                    @if($page->judul_halaman_en)<span class="hint"> · {{ $page->judul_halaman_en }}</span>@endif
                                    <span class="hint"> · {{ $page->status_verifikasi }}</span>
                                </figcaption>
                            </figure>
                        @endforeach
                        <button type="button" class="viewer-nav viewer-prev" data-leaf-prev aria-label="Lembar sebelumnya"><i class="fas fa-chevron-left" aria-hidden="true"></i></button>
                        <button type="button" class="viewer-nav viewer-next" data-leaf-next aria-label="Lembar berikutnya"><i class="fas fa-chevron-right" aria-hidden="true"></i></button>
                    </div>
                    <div class="viewer-strip" role="tablist" aria-label="Daftar lembar">
                        @foreach($lontar->pages as $i => $page)
                            <button type="button" role="tab" class="viewer-thumb @if($i === 0) viewer-thumb-active @endif" data-leaf-goto="{{ $i }}" aria-selected="{{ $i === 0 ? 'true' : 'false' }}">
                                @if($page->photoUrl())
                                    <img src="{{ $page->photoUrl() }}" alt="" loading="lazy">
                                @else
                                    <span class="viewer-thumb-num mono">{{ $page->nomor_lembar }}</span>
                                @endif
                                <span class="viewer-thumb-label">{{ $page->nomor_lembar }}</span>
                            </button>
                        @endforeach
                    </div>
                    <div class="viewer-text">
                        @foreach($lontar->pages as $i => $page)
                            <article class="viewer-page-text @if($i === 0) viewer-page-text-active @endif" data-leaf-text="{{ $i }}">
                                @if($page->penjelasan)<p lang="id">{{ $page->penjelasan }}</p>@endif
                                @if($page->penjelasan_en)<p lang="en" class="hint">{{ $page->penjelasan_en }}</p>@endif
                                @if($page->ringkasan)<p class="hint">{{ $page->ringkasan }}</p>@endif
                                @if($page->catatan)<p class="hint"><em>{{ $page->catatan }}</em></p>@endif
                                @if($page->audioUrl())
                                    <audio controls preload="none" src="{{ $page->audioUrl() }}" style="width:100%;margin-top:.75rem"></audio>
                                    @if($page->audio_verified)<span class="hint" style="display:inline-flex;align-items:center;gap:.3rem;margin-top:.35rem"><i class="fas fa-circle-check" aria-hidden="true"></i> <span data-i18n="audioVerified">Rekaman terverifikasi</span></span>@endif
                                @endif
                            </article>
                        @endforeach
                    </div>
                </div>
            @endif
        </section>
    </div>
</x-layouts.app>
