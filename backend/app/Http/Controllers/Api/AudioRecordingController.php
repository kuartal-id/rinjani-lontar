<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AudioRecording;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AudioRecordingController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'lontar_page_id' => 'required|exists:lontar_pages,id',
            'audio' => 'required|file|mimes:mp3,wav,m4a,mp4,webm,ogg',
            'reader_id' => 'nullable|exists:readers,id',
            'tipe' => 'required|string', // upload or rekam_langsung
        ]);

        $path = $request->file('audio')->store('public/audio');

        $audio = AudioRecording::create([
            'lontar_page_id' => $request->lontar_page_id,
            'reader_id' => $request->reader_id,
            'file_path' => Storage::url($path),
            'tipe' => $request->tipe,
        ]);

        return response()->json($audio);
    }
}
