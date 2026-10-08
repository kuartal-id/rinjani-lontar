<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lontar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LontarController extends Controller
{
    /**
     * Daftar semua naskah dengan jumlah halaman.
     */
    public function index(Request $request)
    {
        $query = Lontar::withCount('pages');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('kode_naskah', 'like', "%$search%")
                  ->orWhere('judul', 'like', "%$search%")
                  ->orWhere('kategori', 'like', "%$search%")
                  ->orWhere('desa_asal', 'like', "%$search%");
            });
        }

        if ($request->filled('kategori') && $request->kategori !== 'Semua') {
            $query->where('kategori', $request->kategori);
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    /**
     * Detail satu naskah beserta semua halamannya (urut nomor lembar).
     */
    public function show($id)
    {
        $lontar = Lontar::with(['category', 'pages'])
            ->withCount('pages')
            ->findOrFail($id);

        return response()->json($lontar);
    }

    /**
     * Tambah naskah baru (admin). Mendukung upload foto_sampul.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'kode_naskah'     => 'nullable|string|unique:lontars,kode_naskah',
            'judul'           => 'required|string|max:255',
            'category_id'     => 'nullable|exists:categories,id',
            'desa_asal'       => 'nullable|string|max:255',
            'perkiraan_tahun' => 'nullable|string|max:100',
            'ringkasan'       => 'nullable|string',
            'bahasa'          => 'nullable|string|max:100',
            'kondisi'         => 'nullable|string|max:100',
            'kategori'        => 'nullable|string|max:100',
            'foto_sampul'     => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
        ]);

        if ($request->hasFile('foto_sampul')) {
            try {
                $path = $request->file('foto_sampul')->store('lontars/covers', 'public');
                $data['foto_sampul'] = '/storage/' . $path;
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'Gagal menyimpan foto sampul: ' . $e->getMessage(),
                ], 500);
            }
        }

        $lontar = Lontar::create($data);

        return response()->json([
            'message' => 'Naskah berhasil ditambahkan',
            'data'    => $lontar->loadCount('pages'),
        ], 201);
    }

    /**
     * Update naskah. Mendukung update foto_sampul.
     */
    public function update(Request $request, $id)
    {
        $lontar = Lontar::findOrFail($id);

        $data = $request->validate([
            'kode_naskah'     => 'nullable|string|unique:lontars,kode_naskah,' . $id,
            'judul'           => 'required|string|max:255',
            'category_id'     => 'nullable|exists:categories,id',
            'desa_asal'       => 'nullable|string|max:255',
            'perkiraan_tahun' => 'nullable|string|max:100',
            'ringkasan'       => 'nullable|string',
            'bahasa'          => 'nullable|string|max:100',
            'kondisi'         => 'nullable|string|max:100',
            'kategori'        => 'nullable|string|max:100',
            'foto_sampul'     => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
        ]);

        if ($request->hasFile('foto_sampul')) {
            // Hapus foto lama
            if ($lontar->foto_sampul) {
                $oldPath = ltrim(str_replace('/storage/', '', $lontar->foto_sampul), '/');
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('foto_sampul')->store('lontars/covers', 'public');
            $data['foto_sampul'] = '/storage/' . $path;
        }

        $lontar->update($data);

        return response()->json([
            'message' => 'Naskah berhasil diperbarui',
            'data'    => $lontar->fresh()->loadCount('pages'),
        ]);
    }

    /**
     * Hapus naskah beserta seluruh halamannya (cascade).
     */
    public function destroy($id)
    {
        $lontar = Lontar::findOrFail($id);

        // Hapus foto sampul
        if ($lontar->foto_sampul) {
            $oldPath = ltrim(str_replace('/storage/', '', $lontar->foto_sampul), '/');
            Storage::disk('public')->delete($oldPath);
        }

        // Hapus foto & audio semua halaman
        foreach ($lontar->pages as $page) {
            if ($page->foto_halaman) {
                $p = ltrim(str_replace('/storage/', '', $page->foto_halaman), '/');
                Storage::disk('public')->delete($p);
            }
            if ($page->audio_file) {
                $p = ltrim(str_replace('/storage/', '', $page->audio_file), '/');
                Storage::disk('public')->delete($p);
            }
        }

        $lontar->delete(); // cascade lontar_pages

        return response()->json(['message' => 'Naskah berhasil dihapus']);
    }
}
