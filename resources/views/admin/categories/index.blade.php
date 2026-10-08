<x-layouts.admin title="Kategori" active="categories">
    <form class="panel" method="POST" action="{{ route('admin.categories.store') }}" style="margin-bottom:1.5rem">
        @csrf
        <h2 class="r-h3" style="margin:0 0 1rem">Tambah kategori</h2>
        <div class="form-grid">
            <label class="field"><span>Nama (Indonesia) *</span><input class="input" name="name" required maxlength="150"></label>
            <label class="field"><span>Nama (English)</span><input class="input" name="name_en" maxlength="150"></label>
            <label class="field"><span>Deskripsi (Indonesia)</span><input class="input" name="description"></label>
            <label class="field"><span>Deskripsi (English)</span><input class="input" name="description_en"></label>
        </div>
        <button class="r-btn" type="submit" style="margin-top:1rem"><i class="fas fa-plus" aria-hidden="true"></i> Tambah</button>
    </form>

    @if($categories->isEmpty())
        <div class="panel panel-body">Belum ada kategori. Catatan: kolom kategori pada naskah juga bisa memakai daftar bawaan konfigurasi (config/lontar.php).</div>
    @else
        <div class="table-wrap">
            <table class="a-table">
                <thead><tr><th>Nama</th><th>English</th><th>Deskripsi</th><th style="text-align:center">Naskah</th><th>Aksi</th></tr></thead>
                <tbody>
                @foreach($categories as $category)
                    <tr>
                        <td><strong>{{ $category->name }}</strong></td>
                        <td>{{ $category->name_en ?: '-' }}</td>
                        <td>{{ $category->description ?: '-' }}</td>
                        <td style="text-align:center">{{ $category->lontars_count }}</td>
                        <td><form method="POST" action="{{ route('admin.categories.destroy', $category) }}" data-confirm="Hapus kategori {{ $category->name }}? Naskah terkait tidak ikut terhapus.">
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
