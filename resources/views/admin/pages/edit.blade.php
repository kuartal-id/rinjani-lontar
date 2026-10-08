<x-layouts.admin :title="($page->exists ? 'Edit lembar' : 'Tambah lembar').' — '.$lontar->judul" active="lontars">
    @php $isEdit = $page->exists; @endphp
    <p style="margin:0 0 1rem"><a class="r-link" href="{{ route('admin.pages.index', $lontar) }}"><i class="fas fa-arrow-left" aria-hidden="true"></i> Kembali ke daftar lembar</a></p>

    <form class="panel" method="POST" enctype="multipart/form-data" action="{{ $isEdit ? route('admin.pages.update', [$lontar, $page]) : route('admin.pages.store', $lontar) }}">
        @csrf
        <div class="form-grid">
            <label class="field"><span>Nomor lembar *</span>
                <input class="input mono" type="number" min="1" name="nomor_lembar" value="{{ old('nomor_lembar', $page->nomor_lembar) }}" required>
                @error('nomor_lembar')<em class="field-error">{{ $message }}</em>@enderror
            </label>
            <label class="field"><span>Judul halaman (Indonesia)</span>
                <input class="input" name="judul_halaman" value="{{ old('judul_halaman', $page->judul_halaman) }}" maxlength="255">
            </label>
            <label class="field"><span>Judul halaman (English)</span>
                <input class="input" name="judul_halaman_en" value="{{ old('judul_halaman_en', $page->judul_halaman_en) }}" maxlength="255">
            </label>
            <label class="field"><span>Kondisi</span>
                <input class="input" name="kondisi" value="{{ old('kondisi', $page->kondisi) }}" maxlength="100">
            </label>
            <label class="field"><span>Status verifikasi</span>
                <select class="select" name="status_verifikasi">
                    @foreach(['Belum diverifikasi', 'Dalam peninjauan', 'Terverifikasi'] as $s)
                        <option value="{{ $s }}" @selected(old('status_verifikasi', $page->status_verifikasi) === $s)>{{ $s }}</option>
                    @endforeach
                </select>
            </label>
        </div>

        <label class="field" style="margin-top:1rem"><span>Penjelasan (Indonesia)</span>
            <textarea class="input" name="penjelasan" rows="4">{{ old('penjelasan', $page->penjelasan) }}</textarea>
        </label>
        <label class="field" style="margin-top:.75rem"><span>Penjelasan (English)</span>
            <textarea class="input" name="penjelasan_en" rows="3">{{ old('penjelasan_en', $page->penjelasan_en) }}</textarea>
        </label>
        <label class="field" style="margin-top:.75rem"><span>Ringkasan</span>
            <textarea class="input" name="ringkasan" rows="2">{{ old('ringkasan', $page->ringkasan) }}</textarea>
        </label>
        <label class="field" style="margin-top:.75rem"><span>Catatan</span>
            <textarea class="input" name="catatan" rows="2">{{ old('catatan', $page->catatan) }}</textarea>
        </label>

        <div class="form-grid" style="margin-top:1rem">
            <label class="field"><span>Foto lembar (pindaian)</span>
                <input class="input" type="file" name="foto_halaman" accept="image/*">
                @if($page->photoUrl())<span class="hint">Saat ini: <img src="{{ $page->photoUrl() }}" alt="" style="height:3rem;border-radius:.35rem"></span>@endif
            </label>
            <label class="field"><span>Foto enhanced (pilihan)</span>
                <input class="input" type="file" name="foto_enhanced" accept="image/*">
                @if($page->enhancedUrl())<span class="hint">Saat ini: <img src="{{ $page->enhancedUrl() }}" alt="" style="height:3rem;border-radius:.35rem"></span>@endif
            </label>
            <label class="field"><span>Rekaman audio</span>
                <input class="input" type="file" name="audio" accept="audio/*">
                @if($page->audioUrl())<span class="hint">Saat ini: <audio controls src="{{ $page->audioUrl() }}" style="height:2rem"></audio></span>@endif
            </label>
            <label class="field"><span style="display:flex;align-items:center;gap:.5rem">
                <input type="hidden" name="audio_verified" value="0">
                <input type="checkbox" name="audio_verified" value="1" @checked(old('audio_verified', $page->audio_verified))> Rekaman audio terverifikasi
            </span></label>
        </div>

        <div style="margin-top:1.5rem;display:flex;gap:.75rem;flex-wrap:wrap">
            <button class="r-btn" type="submit">{{ $isEdit ? 'Simpan perubahan' : 'Tambah lembar' }}</button>
            <a class="r-btn-ghost" href="{{ route('admin.pages.index', $lontar) }}">Batal</a>
        </div>
    </form>
</x-layouts.admin>
