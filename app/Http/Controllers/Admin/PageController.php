<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lontar;
use App\Models\LontarPage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PageController extends Controller
{
    public function index(Lontar $lontar)
    {
        return view('admin.pages.index', ['lontar' => $lontar, 'pages' => $lontar->pages()->paginate(20)]);
    }

    public function create(Lontar $lontar)
    {
        return view('admin.pages.edit', ['lontar' => $lontar, 'page' => new LontarPage(['nomor_lembar' => $lontar->pages()->max('nomor_lembar') + 1])]);
    }

    public function store(Request $request, Lontar $lontar)
    {
        $data = $this->validateData($request);
        $data += $this->storeFiles($request);
        $lontar->pages()->create($data);

        return redirect()->route('admin.pages.index', $lontar)->with('success', 'Lembar ditambahkan.');
    }

    public function edit(Lontar $lontar, LontarPage $page)
    {
        abort_unless($page->lontar_id === $lontar->id, 404);

        return view('admin.pages.edit', ['lontar' => $lontar, 'page' => $page]);
    }

    public function update(Request $request, Lontar $lontar, LontarPage $page)
    {
        abort_unless($page->lontar_id === $lontar->id, 404);
        $data = $this->validateData($request);
        $data += $this->storeFiles($request);
        $page->update($data);

        return redirect()->route('admin.pages.index', $lontar)->with('success', 'Lembar diperbarui.');
    }

    public function destroy(Lontar $lontar, LontarPage $page)
    {
        abort_unless($page->lontar_id === $lontar->id, 404);
        foreach (['foto_halaman', 'foto_enhanced', 'audio_file'] as $f) {
            if ($page->$f) {
                Storage::disk('local')->delete('uploads/'.basename($page->$f));
            }
        }
        $page->delete();

        return redirect()->route('admin.pages.index', $lontar)->with('success', 'Lembar dihapus.');
    }

    private function validateData(Request $request): array
    {
        return $request->validate([
            'nomor_lembar' => ['required', 'integer', 'min:1'],
            'judul_halaman' => ['nullable', 'string', 'max:255'],
            'judul_halaman_en' => ['nullable', 'string', 'max:255'],
            'kondisi' => ['nullable', 'string', 'max:100'],
            'status_verifikasi' => ['nullable', 'string', 'max:50'],
            'ringkasan' => ['nullable', 'string'],
            'penjelasan' => ['nullable', 'string'],
            'penjelasan_en' => ['nullable', 'string'],
            'catatan' => ['nullable', 'string'],
            'foto_halaman' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:'.config('lontar.upload_max_kb')],
            'foto_enhanced' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:'.config('lontar.upload_max_kb')],
            'audio' => ['nullable', 'file', 'mimes:mp3,m4a,ogg,wav', 'max:'.config('lontar.upload_max_kb')],
            'audio_verified' => ['nullable', 'boolean'],
        ]);
    }

    private function storeFiles(Request $request): array
    {
        $out = [];
        foreach (['foto_halaman' => 'image', 'foto_enhanced' => 'image', 'audio' => 'audio'] as $field => $prefix) {
            if ($request->hasFile($field) && $request->file($field)->isValid()) {
                $ext = $request->file($field)->getClientOriginalExtension();
                $out[$field === 'audio' ? 'audio_file' : $field] = $request->file($field)
                    ->storeAs('uploads', date('Ymd_His').'_'.$prefix.'_'.Str::random(8).'.'.$ext, 'local');
                if ($field === 'audio') {
                    $out['audio_tipe'] = 'upload';
                }
            }
        }

        return $out;
    }
}
