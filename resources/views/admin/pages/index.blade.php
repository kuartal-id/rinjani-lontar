<x-layouts.admin :title="'Lembar — '.$lontar->judul" active="lontars">
    <p style="margin:0 0 1rem"><a class="r-link" href="{{ route('admin.lontars.index') }}"><i class="fas fa-arrow-left" aria-hidden="true"></i> Kembali ke data naskah</a></p>
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.75rem;margin-bottom:1rem">
        <h2 class="r-h3" style="margin:0">{{ $lontar->judul }}</h2>
        <a class="r-btn" href="{{ route('admin.pages.create', $lontar) }}"><i class="fas fa-plus" aria-hidden="true"></i> Tambah lembar</a>
    </div>

    @if($pages->isEmpty())
        <div class="panel panel-body">Belum ada lembar untuk naskah ini.</div>
    @else
        <div class="table-wrap">
            <table class="a-table">
                <thead><tr><th>No.</th><th>Judul halaman</th><th>Kondisi</th><th>Verifikasi</th><th style="text-align:center">Foto</th><th style="text-align:center">Audio</th><th>Aksi</th></tr></thead>
                <tbody>
                @foreach($pages as $page)
                    <tr>
                        <td class="mono">{{ $page->nomor_lembar }}</td>
                        <td><strong>{{ $page->judul_halaman ?: '—' }}</strong>@if($page->judul_halaman_en)<div class="hint" style="margin:0">{{ $page->judul_halaman_en }}</div>@endif</td>
                        <td>{{ $page->kondisi ?: '-' }}</td>
                        <td>{{ $page->status_verifikasi }}</td>
                        <td style="text-align:center">@if($page->photoUrl())<a class="r-link" href="{{ $page->photoUrl() }}" target="_blank" rel="noopener"><i class="fas fa-image" aria-hidden="true"></i></a>@else — @endif</td>
                        <td style="text-align:center">@if($page->audioUrl())<i class="fas fa-volume-high" aria-hidden="true"></i>@else — @endif</td>
                        <td><div class="row-actions">
                            <a class="r-btn-ghost r-btn-sm" href="{{ route('admin.pages.edit', [$lontar, $page]) }}">Edit</a>
                            <form method="POST" action="{{ route('admin.pages.destroy', [$lontar, $page]) }}" data-confirm="Hapus lembar {{ $page->nomor_lembar }}?">
                                @csrf
                                <button class="r-btn-ghost r-btn-sm danger" type="submit">Hapus</button>
                            </form>
                        </div></td>
                    </tr>
                @endforeach
                </tbody>
            </table>
        </div>
        {{ $pages->links() }}
    @endif
</x-layouts.admin>
