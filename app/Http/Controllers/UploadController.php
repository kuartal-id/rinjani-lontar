<?php

namespace App\Http\Controllers;

use App\Models\Lontar;
use Illuminate\Support\Facades\Storage;

/**
 * Serves uploaded files (page scans, enhanced scans, audio, covers, reader photos)
 * from the private UPLOADS_PATH disk. Basename-only lookups — traversal is impossible.
 */
class UploadController extends Controller
{
    public function show(string $filename)
    {
        if (! preg_match('/^[A-Za-z0-9._-]+$/', $filename) || str_starts_with($filename, '.')) {
            abort(404);
        }

        $disk = Storage::disk('local');
        if (! $disk->exists("uploads/{$filename}")) {
            abort(404);
        }

        $mime = match (strtolower(pathinfo($filename, PATHINFO_EXTENSION))) {
            'jpg', 'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'webp' => 'image/webp',
            'gif' => 'image/gif',
            'svg' => 'image/svg+xml',
            'mp3' => 'audio/mpeg',
            'm4a' => 'audio/mp4',
            'ogg' => 'audio/ogg',
            'wav' => 'audio/wav',
            default => 'application/octet-stream',
        };

        return response()->file($disk->path("uploads/{$filename}"), [
            'Content-Type' => $mime,
            'Cache-Control' => 'public, max-age=31536000, immutable',
        ]);
    }

    /** JSON used by the public archive (and any future family consumers). */
    public function index()
    {
        return response()->json(
            Lontar::with('category')->withCount('pages')->orderBy('judul')->get()
                ->map(fn ($l) => [
                    'id' => $l->id,
                    'kode_naskah' => $l->kode_naskah,
                    'judul' => $l->judul,
                    'judul_en' => $l->judul_en,
                    'slug' => $l->slug,
                    'kategori' => $l->kategori,
                    'desa_asal' => $l->desa_asal,
                    'bahasa' => $l->bahasa,
                    'jumlah_halaman' => $l->pages_count,
                    'sampul' => $l->coverUrl(),
                    'is_sample' => $l->is_sample,
                ])
        );
    }

    public function health()
    {
        return response()->json(['status' => 'ok', 'message' => 'Lontar Digital Archive API running']);
    }
}
