<x-layouts.admin title="Pembaca" active="readers">
    <form class="panel" method="POST" enctype="multipart/form-data" action="{{ route('admin.readers.store') }}" style="margin-bottom:1.5rem">
        @csrf
        <h2 class="r-h3" style="margin:0 0 1rem">Tambah pembaca</h2>
        <div class="form-grid">
            <label class="field"><span>Nama *</span><input class="input" name="nama" required maxlength="150"></label>
            <label class="field"><span>Keahlian</span><input class="input" name="keahlian" maxlength="255" placeholder="mis. Aksara Sasak, merangkum lontar"></label>
            <label class="field"><span>Asal</span><input class="input" name="asal" maxlength="255" placeholder="Desa, kecamatan"></label>
            <label class="field"><span>Foto</span><input class="input" type="file" name="foto" accept="image/*"></label>
        </div>
        <label class="field" style="margin-top:.75rem"><span>Deskripsi</span><textarea class="input" name="deskripsi" rows="2"></textarea></label>
        <button class="r-btn" type="submit" style="margin-top:1rem"><i class="fas fa-plus" aria-hidden="true"></i> Tambah</button>
    </form>

    @if($readers->isEmpty())
        <div class="panel panel-body">Belum ada pembaca terdaftar.</div>
    @else
        <div class="table-wrap">
            <table class="a-table">
                <thead><tr><th></th><th>Nama</th><th>Keahlian</th><th>Asal</th><th>Aksi</th></tr></thead>
                <tbody>
                @foreach($readers as $reader)
                    <tr>
                        <td><img src="{{ $reader->photoUrl() }}" alt="" style="height:2.5rem;width:2.5rem;object-fit:cover;border-radius:.4rem"></td>
                        <td><strong>{{ $reader->nama }}</strong></td>
                        <td>{{ $reader->keahlian ?: '-' }}</td>
                        <td>{{ $reader->asal ?: '-' }}</td>
                        <td><form method="POST" action="{{ route('admin.readers.destroy', $reader) }}" data-confirm="Hapus pembaca {{ $reader->nama }}?">
                            @csrf
                            <button class="r-btn-ghost r-btn-sm danger" type="submit">Hapus</button>
                        </form></td>
                    </tr>
                @endforeach
                </tbody>
            </table>
        </div>
    @endif
</x-layouts.admin>
