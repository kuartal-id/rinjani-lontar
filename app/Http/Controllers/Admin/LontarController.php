<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lontar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class LontarController extends Controller
{
    public function index()
    {
        return view('admin.lontars.index', ['lontars' => Lontar::withCount('pages')->latest()->paginate(15)]);
    }

    public function create()
    {
        return view('admin.lontars.edit', ['lontar' => new Lontar(), 'categories' => config('lontar.categories')]);
    }

    public function store(Request $request)
    {
        $data = $this->validateData($request);
        $data['slug'] = $this->uniqueSlug($data['judul']);

        if ($cover = $this->storeUpload($request, 'foto_sampul')) {
            $data['foto_sampul'] = $cover;
        }
        unset($data['cover']);

        Lontar::create($data);

        return redirect()->route('admin.lontars.index')->with('success', 'Naskah dibuat.');
    }

    public function edit(Lontar $lontar)
    {
        return view('admin.lontars.edit', [
            'lontar' => $lontar,
            'categories' => config('lontar.categories'),
        ]);
    }

    public function update(Request $request, Lontar $lontar)
    {
        $data = $this->validateData($request);
        if ($cover = $this->storeUpload($request, 'foto_sampul')) {
            $data['foto_sampul'] = $cover;
        }
        unset($data['cover']);

        $lontar->update($data);

        return redirect()->route('admin.lontars.edit', $lontar)->with('success', 'Naskah diperbarui.');
    }

    public function destroy(Lontar $lontar)
    {
        foreach ($lontar->pages as $page) {
            $this->deletePageFiles($page);
        }
        if ($lontar->foto_sampul) {
            Storage::disk('local')->delete('uploads/'.basename($lontar->foto_sampul));
        }
        $lontar->delete();

        return redirect()->route('admin.lontars.index')->with('success', 'Naskah dihapus.');
    }

    private function validateData(Request $request): array
    {
        return $request->validate([
            'kode_naskah' => ['nullable', 'string', 'max:50'],
            'judul' => ['required', 'string', 'max:255'],
            'judul_en' => ['nullable', 'string', 'max:255'],
            'desa_asal' => ['nullable', 'string', 'max:255'],
            'perkiraan_tahun' => ['nullable', 'string', 'max:100'],
            'bahasa' => ['nullable', 'string', 'max:100'],
            'kondisi' => ['nullable', 'string', 'max:100'],
            'kategori' => ['nullable', 'string', 'max:150'],
            'ringkasan' => ['nullable', 'string'],
            'ringkasan_en' => ['nullable', 'string'],
            'cover' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:'.config('lontar.upload_max_kb')],
        ]);
    }

    private function uniqueSlug(string $judul): string
    {
        $base = Str::slug($judul) ?: 'naskah';
        $slug = $base;
        $i = 2;
        while (Lontar::where('slug', $slug)->exists()) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }

    private function storeUpload(Request $request, string $field): ?string
    {
        if (! $request->hasFile($field) || ! $request->file($field)->isValid()) {
            return null;
        }

        $name = date('Ymd_His').'_'.Str::random(8).'.'.$request->file($field)->getClientOriginalExtension();

        return $request->file($field)->storeAs('uploads', $name, 'local');
    }

    private function deletePageFiles($page): void
    {
        foreach (['foto_halaman', 'foto_enhanced', 'audio_file'] as $f) {
            if ($page->$f) {
                Storage::disk('local')->delete('uploads/'.basename($page->$f));
            }
        }
    }
}
