<?php

namespace App\Http\Controllers;

use App\Models\Lontar;

class LontarController extends Controller
{
    public function show(string $slug)
    {
        $lontar = Lontar::with(['pages', 'category'])
            ->where('slug', $slug)
            ->orWhere('id', $slug)
            ->firstOrFail();

        return view('detail', ['lontar' => $lontar]);
    }
}
