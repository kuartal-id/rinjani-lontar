<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\LontarController as AdminLontarController;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\Admin\ReaderController;
use App\Http\Controllers\ArchiveController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\LontarController;
use App\Http\Controllers\UploadController;
use Illuminate\Support\Facades\Route;

// Public ---------------------------------------------------------------
Route::get('/', [ArchiveController::class, 'index'])->name('archive');
Route::get('/about', [ArchiveController::class, 'about'])->name('about');
Route::get('/naskah/{slug}', [LontarController::class, 'show'])->name('lontar.show');
Route::get('/media/{filename}', [UploadController::class, 'show'])->where('filename', '[^/]+')->name('uploads.show');

// JSON API lives in routes/api.php (served under /api automatically).

// Auth -----------------------------------------------------------------
Route::redirect('/login', '/auth/login');
Route::prefix('auth')->group(function () {
    Route::get('/login', [LoginController::class, 'show'])->name('login')->middleware('guest');
    Route::post('/login', [LoginController::class, 'store'])->middleware(['guest', 'throttle:8,1'])->name('login.store');
    Route::get('/logout', [LoginController::class, 'destroy'])->middleware('auth')->name('logout');
});

// Admin ----------------------------------------------------------------
Route::prefix('admin')->name('admin.')->middleware('auth')->group(function () {
    Route::get('/', [DashboardController::class, 'index']);
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/lontars', [AdminLontarController::class, 'index'])->name('lontars.index');
    Route::get('/lontars/create', [AdminLontarController::class, 'create'])->name('lontars.create');
    Route::post('/lontars/create', [AdminLontarController::class, 'store'])->name('lontars.store');
    Route::get('/lontars/{lontar}/edit', [AdminLontarController::class, 'edit'])->name('lontars.edit');
    Route::post('/lontars/{lontar}/edit', [AdminLontarController::class, 'update'])->name('lontars.update');
    Route::post('/lontars/{lontar}/delete', [AdminLontarController::class, 'destroy'])->name('lontars.destroy');

    Route::get('/lontars/{lontar}/pages', [PageController::class, 'index'])->name('pages.index');
    Route::get('/lontars/{lontar}/pages/create', [PageController::class, 'create'])->name('pages.create');
    Route::post('/lontars/{lontar}/pages/create', [PageController::class, 'store'])->name('pages.store');
    Route::get('/lontars/{lontar}/pages/{page}/edit', [PageController::class, 'edit'])->name('pages.edit');
    Route::post('/lontars/{lontar}/pages/{page}/edit', [PageController::class, 'update'])->name('pages.update');
    Route::post('/lontars/{lontar}/pages/{page}/delete', [PageController::class, 'destroy'])->name('pages.destroy');

    Route::get('/readers', [ReaderController::class, 'index'])->name('readers.index');
    Route::post('/readers', [ReaderController::class, 'store'])->name('readers.store');
    Route::post('/readers/{reader}/delete', [ReaderController::class, 'destroy'])->name('readers.destroy');

    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::post('/categories/{category}/delete', [CategoryController::class, 'destroy'])->name('categories.destroy');
});
