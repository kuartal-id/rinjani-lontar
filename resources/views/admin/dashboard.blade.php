<x-layouts.admin title="Dashboard">
    <div class="stat-grid">
        <div class="stat-card"><i class="fas fa-book" aria-hidden="true"></i><div><strong>{{ $lontarCount }}</strong><span>Naskah</span></div></div>
        <div class="stat-card"><i class="fas fa-layer-group" aria-hidden="true"></i><div><strong>{{ $pageCount }}</strong><span>Lembar</span></div></div>
        <div class="stat-card"><i class="fas fa-headphones" aria-hidden="true"></i><div><strong>{{ $readerCount }}</strong><span>Pembaca</span></div></div>
        <div class="stat-card"><i class="fas fa-tags" aria-hidden="true"></i><div><strong>{{ $categoryCount }}</strong><span>Kategori</span></div></div>
    </div>

    <section class="panel" style="margin-top:1.5rem">
        <div class="panel-head">
            <h2 class="r-h3" style="margin:0">Naskah terbaru</h2>
            <a class="r-btn-ghost r-btn-sm" href="{{ route('admin.lontars.index') }}">Kelola naskah</a>
        </div>
        <div class="table-wrap">
            <table class="a-table">
                <thead><tr><th>Judul</th><th>Kode</th><th>Kategori</th><th>Lembar</th><th></th></tr></thead>
                <tbody>
                    @forelse($recentLontars as $lontar)
                        <tr>
                            <td><strong>{{ $lontar->judul }}</strong>@if($lontar->is_sample)<span class="lontar-flag" style="position:static;margin-left:.4rem">Contoh</span>@endif</td>
                            <td class="mono">{{ $lontar->kode_naskah ?: '-' }}</td>
                            <td>{{ $lontar->kategori ?: '-' }}</td>
                            <td>{{ $lontar->pages->count() }}</td>
                            <td><a class="r-btn-ghost r-btn-sm" href="{{ route('admin.lontars.edit', $lontar) }}">Edit</a></td>
                        </tr>
                    @empty
                        <tr><td colspan="5" class="hint">Belum ada naskah. <a class="r-link" href="{{ route('admin.lontars.create') }}">Tambah naskah pertama</a>.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </section>
</x-layouts.admin>
