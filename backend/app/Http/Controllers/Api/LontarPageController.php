<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LontarPage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LontarPageController extends Controller
{
    /**
     * Daftar semua halaman, atau filter berdasarkan lontar_id.
     */
    public function index(Request $request)
    {
        $query = LontarPage::query();

        if ($request->filled('lontar_id')) {
            $query->where('lontar_id', $request->lontar_id);
        }

        return response()->json($query->orderBy('nomor_lembar', 'asc')->get());
    }

    /**
     * Detail satu halaman.
     */
    public function show($id)
    {
        return response()->json(LontarPage::findOrFail($id));
    }

    /**
     * Tambah halaman ke dalam naskah. Mendukung upload foto_halaman dan audio_file.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'lontar_id'     => 'required|exists:lontars,id',
            'nomor_lembar'  => 'required|integer|min:1',
            'judul_halaman' => 'nullable|string|max:255',
            'kondisi'       => 'nullable|string|max:100',
            'ringkasan'     => 'nullable|string',
            'penjelasan'    => 'nullable|string',
            'catatan'       => 'nullable|string',
            'nama_pembaca'  => 'nullable|string|max:255',
            'audio_verified'=> 'nullable|boolean',
            'audio_tipe'    => 'nullable|string|max:50',
            'foto_halaman'  => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
            'foto_enhanced' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
            'audio_file'    => 'nullable|file|mimes:mp3,wav,m4a,mp4,webm,ogg,aac,flac,oga,3gp,m4v,mov|max:10240',
        ]);

        $lontarId = $request->lontar_id;

        try {
            if ($request->hasFile('foto_halaman')) {
                $path = $request->file('foto_halaman')->store("lontars/{$lontarId}/pages", 'public');
                $data['foto_halaman'] = '/storage/' . $path;
            }

            if ($request->hasFile('foto_enhanced')) {
                $path = $request->file('foto_enhanced')->store("lontars/{$lontarId}/enhanced", 'public');
                $data['foto_enhanced'] = '/storage/' . $path;
            }

            if ($request->hasFile('audio_file')) {
                $path = $request->file('audio_file')->store("lontars/{$lontarId}/audio", 'public');
                $data['audio_file'] = '/storage/' . $path;
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menyimpan file media: ' . $e->getMessage(),
            ], 500);
        }

        $page = LontarPage::create($data);

        return response()->json([
            'message' => 'Halaman berhasil ditambahkan',
            'data'    => $page->fresh(),
        ], 201);
    }

    /**
     * Update halaman. Mendukung ganti foto dan audio.
     */
    public function update(Request $request, $id)
    {
        $page = LontarPage::findOrFail($id);

        $data = $request->validate([
            'nomor_lembar'  => 'nullable|integer|min:1',
            'judul_halaman' => 'nullable|string|max:255',
            'kondisi'       => 'nullable|string|max:100',
            'ringkasan'     => 'nullable|string',
            'penjelasan'    => 'nullable|string',
            'catatan'       => 'nullable|string',
            'nama_pembaca'  => 'nullable|string|max:255',
            'audio_verified'=> 'nullable|boolean',
            'audio_tipe'    => 'nullable|string|max:50',
            'foto_halaman'  => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
            'foto_enhanced' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
            'audio_file'    => 'nullable|file|mimes:mp3,wav,m4a,mp4,webm,ogg,aac,flac,oga,3gp,m4v,mov|max:10240',
        ]);

        if ($request->hasFile('foto_halaman')) {
            if ($page->foto_halaman) {
                $oldPath = ltrim(str_replace('/storage/', '', $page->foto_halaman), '/');
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('foto_halaman')->store("lontars/{$page->lontar_id}/pages", 'public');
            $data['foto_halaman'] = '/storage/' . $path;
        }

        if ($request->hasFile('foto_enhanced')) {
            if ($page->foto_enhanced) {
                $oldPath = ltrim(str_replace('/storage/', '', $page->foto_enhanced), '/');
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('foto_enhanced')->store("lontars/{$page->lontar_id}/enhanced", 'public');
            $data['foto_enhanced'] = '/storage/' . $path;
        }

        if ($request->hasFile('audio_file')) {
            if ($page->audio_file) {
                $oldPath = ltrim(str_replace('/storage/', '', $page->audio_file), '/');
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('audio_file')->store("lontars/{$page->lontar_id}/audio", 'public');
            $data['audio_file'] = '/storage/' . $path;
        }

        $page->update($data);

        return response()->json([
            'message' => 'Halaman berhasil diperbarui',
            'data'    => $page->fresh(),
        ]);
    }

    /**
     * Hapus halaman beserta file media-nya.
     */
    public function destroy($id)
    {
        $page = LontarPage::findOrFail($id);

        if ($page->foto_halaman) {
            Storage::disk('public')->delete(ltrim(str_replace('/storage/', '', $page->foto_halaman), '/'));
        }
        if ($page->foto_enhanced) {
            Storage::disk('public')->delete(ltrim(str_replace('/storage/', '', $page->foto_enhanced), '/'));
        }
        if ($page->audio_file) {
            Storage::disk('public')->delete(ltrim(str_replace('/storage/', '', $page->audio_file), '/'));
        }

        $page->delete();

        return response()->json(['message' => 'Halaman berhasil dihapus']);
    }

    /**
     * Upload audio rekaman langsung dari browser (terpisah dari form utama).
     */
    public function uploadAudio(Request $request, $id)
    {
        $page = LontarPage::findOrFail($id);

        $request->validate([
            'audio'          => 'required|file|mimes:mp3,wav,m4a,mp4,webm,ogg,aac,flac,oga,3gp,m4v,mov|max:10240',
            'tipe'           => 'required|string',
            'nama_pembaca'   => 'nullable|string|max:255',
            'audio_verified' => 'nullable|boolean',
        ]);

        // Hapus audio lama
        if ($page->audio_file) {
            Storage::disk('public')->delete(ltrim(str_replace('/storage/', '', $page->audio_file), '/'));
        }

        $path = $request->file('audio')->store("lontars/{$page->lontar_id}/audio", 'public');

        $page->update([
            'audio_file'     => '/storage/' . $path,
            'audio_tipe'     => $request->tipe,
            'nama_pembaca'   => $request->nama_pembaca ?? $page->nama_pembaca,
            'audio_verified' => $request->boolean('audio_verified', false),
        ]);

        return response()->json([
            'message' => 'Audio berhasil diupload',
            'data'    => $page->fresh(),
        ]);
    }

    /**
     * Upload gambar hasil AI Enhancement (foto_enhanced).
     * Disiapkan untuk edge computing di masa depan.
     */
    public function uploadEnhanced(Request $request, $id)
    {
        $page = LontarPage::findOrFail($id);

        $request->validate([
            'foto_enhanced' => 'required|image|mimes:jpeg,png,jpg,webp|max:10240',
        ]);

        if ($page->foto_enhanced) {
            Storage::disk('public')->delete(ltrim(str_replace('/storage/', '', $page->foto_enhanced), '/'));
        }

        $path = $request->file('foto_enhanced')->store("lontars/{$page->lontar_id}/enhanced", 'public');
        $page->update(['foto_enhanced' => '/storage/' . $path]);

        return response()->json([
            'message' => 'Gambar enhanced berhasil diupload',
            'data'    => $page->fresh(),
        ]);
    }

    /**
     * Upload gambar dari edge computing (lama, dipertahankan untuk kompatibilitas).
     */
    public function uploadImages(Request $request, $id)
    {
        $page = LontarPage::findOrFail($id);

        if ($request->hasFile('original')) {
            $path = $request->file('original')->store("lontars/{$page->lontar_id}/pages", 'public');
            $page->update(['foto_halaman' => '/storage/' . $path]);
        }

        if ($request->hasFile('enhanced')) {
            $path = $request->file('enhanced')->store("lontars/{$page->lontar_id}/enhanced", 'public');
            $page->update(['foto_enhanced' => '/storage/' . $path]);
        }

        return response()->json(['message' => 'Images uploaded successfully', 'data' => $page->fresh()]);
    }
}
