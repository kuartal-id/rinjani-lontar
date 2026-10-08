<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Lontar;
use App\Models\LontarPage;
use App\Models\Reader;

class DashboardController extends Controller
{
    public function index()
    {
        return view('admin.dashboard', [
            'lontarCount' => Lontar::count(),
            'pageCount' => LontarPage::count(),
            'readerCount' => Reader::count(),
            'categoryCount' => Category::count(),
            'recentLontars' => Lontar::latest()->take(5)->get(),
        ]);
    }
}
