<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Lontar;
use Illuminate\Http\Request;

class ArchiveController extends Controller
{
    public function index(Request $request)
    {
        $query = Lontar::query()->with('category')->withCount('pages')->latest();

        if ($search = trim((string) $request->query('q', ''))) {
            $query->where(function ($q) use ($search) {
                $q->where('judul', 'like', "%{$search}%")
                    ->orWhere('judul_en', 'like', "%{$search}%")
                    ->orWhere('kode_naskah', 'like', "%{$search}%")
                    ->orWhere('desa_asal', 'like', "%{$search}%")
                    ->orWhere('ringkasan', 'like', "%{$search}%");
            });
        }

        if ($category = $request->query('kategori')) {
            $query->where('kategori', $category);
        }

        return view('home', [
            'lontars' => $query->paginate(12)->withQueryString(),
            'categories' => config('lontar.categories'),
            'activeCategory' => $category,
            'search' => $search,
            'total' => Lontar::count(),
        ]);
    }

    public function about()
    {
        return view('about', ['readers' => \App\Models\Reader::orderBy('nama')->get()]);
    }
}
