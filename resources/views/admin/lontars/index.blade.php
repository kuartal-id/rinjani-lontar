<x-layouts.admin title="Data naskah" active="lontars">
    <div style="display:flex;justify-content:flex-end;margin-bottom:1rem">
        <a class="r-btn" href="{{ route('admin.lontars.create') }}"><i class="fas fa-plus" aria-hidden="true"></i> Tambah naskah</a>
    </div>

    @if($lontars->isEmpty())
        <div class="panel panel-body">Belum ada naskah.</div>
    @else
        <div class="table-wrap">
            <table class="a-table">
                <thead><tr><th>Kode</th><th>Judul</th><th>Kategori</th><th>Desa asal</th><th style="text-align:center">Lembar</th><th>Aksi</th></tr></thead>
                <tbody>
                @foreach($lontars as $lontar)
                    <tr>
                        <td class="mono">{{ $lontar->kode_naskah ?: '-' }}</td>
                        <td>
                            <strong>{{ $lontar->judul }}</strong>
                            @if($lontar->is_sample)<span class="lontar-flag" style="position:static;margin-left:.4rem">Contoh</span>@endif
                            @if($lontar->judul_en)<div class="hint" style="margin:0">{{ $lontar->judul_en }}</div>@endif
                        </td>
                        <td>{{ $lontar->kategori ?: '-' }}</td>
                        <td>{{ $lontar->desa_asal ?: '-' }}</td>
                        <td style="text-align:center"><a class="r-link" href="{{ route('admin.pages.index', $lontar) }}">{{ $lontar->pages_count }}</a></td>
                        <td><div class="row-actions">
                            <a class="r-btn-ghost r-btn-sm" href="{{ route('lontar.show', $lontar->slug) }}" target="_blank" rel="noopener">Lihat</a>
                            <a class="r-btn-ghost r-btn-sm" href="{{ route('admin.lontars.edit', $lontar) }}">Edit</a>
                            <a class="r-btn-ghost r-btn-sm" href="{{ route('admin.pages.index', $lontar) }}">Lembar</a>
                            <form method="POST" action="{{ route('admin.lontars.destroy', $lontar) }}" data-confirm="Hapus naskah &quot;{{ $lontar->judul }}&quot; beserta semua lembarnya? Tindakan ini tidak dapat dibatalkan.">
                                @csrf
                                <button class="r-btn-ghost r-btn-sm danger" type="submit">Hapus</button>
                            </form>
                        </div></td>
                    </tr>
                @endforeach
                </tbody>
            </table>
        </div>
        {{ $lontars->links() }}
    @endif
</x-layouts.admin>
