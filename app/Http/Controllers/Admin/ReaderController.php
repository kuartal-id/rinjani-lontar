<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reader;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ReaderController extends Controller
{
    public function index()
    {
        return view('admin.readers.index', ['readers' => Reader::orderBy('nama')->get()]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nama' => ['required', 'string', 'max:150'],
            'keahlian' => ['nullable', 'string', 'max:255'],
            'asal' => ['nullable', 'string', 'max:255'],
            'deskripsi' => ['nullable', 'string'],
            'foto' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:'.config('lontar.upload_max_kb')],
        ]);
        if ($request->hasFile('foto') && $request->file('foto')->isValid()) {
            $data['foto'] = $request->file('foto')
                ->storeAs('uploads', date('Ymd_His').'_reader_'.Str::random(8).'.'.$request->file('foto')->getClientOriginalExtension(), 'local');
        }
        Reader::create($data);

        return back()->with('success', 'Pembaca ditambahkan.');
    }

    public function destroy(Reader $reader)
    {
        if ($reader->foto) {
            Storage::disk('local')->delete('uploads/'.basename($reader->foto));
        }
        $reader->delete();

        return back()->with('success', 'Pembaca dihapus.');
    }
}
