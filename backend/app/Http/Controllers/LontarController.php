<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lontar;
use Illuminate\Support\Facades\Storage;

class LontarController extends Controller
{
    public function index(Request $request)
    {
        $query = Lontar::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where('nomor_lembar', 'like', "%$search%")
                  ->orWhere('judul', 'like', "%$search%")
                  ->orWhere('kategori', 'like', "%$search%")
                  ->orWhere('lokasi', 'like', "%$search%");
        }

        if ($request->has('kategori') && $request->kategori !== 'Semua') {
            $query->where('kategori', $request->kategori);
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function show($id)
    {
        $lontar = Lontar::findOrFail($id);
        return response()->json($lontar);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nomor_lembar' => 'required|unique:lontars',
            'judul' => 'required',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:20048', // 20MB limit for high-res
        ]);

        $data = $request->all();

        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('lontars', 'public');
            $data['foto'] = $path;
        }

        $lontar = Lontar::create($data);
        return response()->json(['message' => 'Lontar berhasil ditambahkan', 'data' => $lontar], 201);
    }

    public function update(Request $request, $id)
    {
        $lontar = Lontar::findOrFail($id);

        $request->validate([
            'nomor_lembar' => 'required|unique:lontars,nomor_lembar,' . $id,
            'judul' => 'required',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:20048',
        ]);

        $data = $request->all();

        if ($request->hasFile('foto')) {
            if ($lontar->foto) {
                Storage::disk('public')->delete($lontar->foto);
            }
            $path = $request->file('foto')->store('lontars', 'public');
            $data['foto'] = $path;
        }

        $lontar->update($data);
        return response()->json(['message' => 'Lontar berhasil diupdate', 'data' => $lontar]);
    }

    public function destroy($id)
    {
        $lontar = Lontar::findOrFail($id);
        if ($lontar->foto) {
            Storage::disk('public')->delete($lontar->foto);
        }
        $lontar->delete();
        return response()->json(['message' => 'Lontar berhasil dihapus']);
    }
}
