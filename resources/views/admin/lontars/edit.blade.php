<x-layouts.admin :title="$lontar->exists ? 'Edit naskah' : 'Tambah naskah'" :active="$lontar->exists ? 'lontars' : 'create'">
    @php $isEdit = $lontar->exists; @endphp
    <form class="panel" method="POST" enctype="multipart/form-data" action="{{ $isEdit ? route('admin.lontars.update', $lontar) : route('admin.lontars.store') }}">
        @csrf
        <div class="form-grid">
            <label class="field"><span>Judul (Indonesia) *</span>
                <input class="input" name="judul" value="{{ old('judul', $lontar->judul) }}" required maxlength="255">
                @error('judul')<em class="field-error">{{ $message }}</em>@enderror
            </label>
            <label class="field"><span>Judul (English)</span>
                <input class="input" name="judul_en" value="{{ old('judul_en', $lontar->judul_en) }}" maxlength="255">
            </label>
            <label class="field"><span>Kode naskah</span>
                <input class="input mono" name="kode_naskah" value="{{ old('kode_naskah', $lontar->kode_naskah) }}" maxlength="50" placeholder="mis. LOT-001">
            </label>
            <label class="field"><span>Kategori</span>
                <select class="select" name="kategori">
                    <option value="">— Pilih kategori —</option>
                    @foreach($categories as $c)<option value="{{ $c }}" @selected(old('kategori', $lontar->kategori) === $c)>{{ $c }}</option>@endforeach
                </select>
            </label>
            <label class="field"><span>Desa asal</span>
                <input class="input" name="desa_asal" value="{{ old('desa_asal', $lontar->desa_asal) }}" maxlength="255">
            </label>
            <label class="field"><span>Perkiraan tahun</span>
                <input class="input" name="perkiraan_tahun" value="{{ old('perkiraan_tahun', $lontar->perkiraan_tahun) }}" maxlength="100" placeholder="mis. ±1890">
            </label>
            <label class="field"><span>Bahasa</span>
                <input class="input" name="bahasa" value="{{ old('bahasa', $lontar->bahasa) }}" maxlength="100" placeholder="Sasak / Kawi / Melayu">
            </label>
            <label class="field"><span>Kondisi</span>
                <input class="input" name="kondisi" value="{{ old('kondisi', $lontar->kondisi) }}" maxlength="100" placeholder="mis. Bagus, beberapa robek kecil">
            </label>
        </div>

        <label class="field" style="margin-top:1rem"><span>Ringkasan (Indonesia)</span>
            <textarea class="input" name="ringkasan" rows="4">{{ old('ringkasan', $lontar->ringkasan) }}</textarea>
        </label>
        <label class="field" style="margin-top:.75rem"><span>Ringkasan (English)</span>
            <textarea class="input" name="ringkasan_en" rows="3">{{ old('ringkasan_en', $lontar->ringkasan_en) }}</textarea>
        </label>

        <label class="field" style="margin-top:1rem"><span>Foto sampul</span>
            <input class="input" type="file" name="cover" accept="image/*">
            @if($lontar->foto_sampul)<span class="hint">Sampul saat ini: <img src="{{ $lontar->coverUrl() }}" alt="" style="height:3rem;width:auto;vertical-align:middle;border-radius:.35rem"></span>@endif
        </label>

        <div style="margin-top:1.5rem;display:flex;gap:.75rem;flex-wrap:wrap">
            <button class="r-btn" type="submit">{{ $isEdit ? 'Simpan perubahan' : 'Buat naskah' }}</button>
            <a class="r-btn-ghost" href="{{ route('admin.lontars.index') }}">Batal</a>
            @if($isEdit)
                <a class="r-btn-ghost" href="{{ route('admin.pages.index', $lontar) }}"><i class="fas fa-layer-group" aria-hidden="true"></i> Kelola lembar</a>
            @endif
        </div>
    </form>
</x-layouts.admin>
