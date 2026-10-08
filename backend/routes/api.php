<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LontarController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ReaderController;
use App\Http\Controllers\Api\LontarPageController;
use App\Http\Controllers\Api\AudioRecordingController;

// ─── Authentication Routes ─────────────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('me', [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);
        Route::put('account', [AuthController::class, 'updateAccount']);
    });
});

// ─── Public Routes (Pengunjung) ────────────────────────────────────────────────

// Koleksi naskah: GET /api/lontars?search=...&kategori=...
Route::get('lontars', [LontarController::class, 'index']);
// Detail naskah + semua halaman: GET /api/lontars/{id}
Route::get('lontars/{id}', [LontarController::class, 'show']);

// Halaman per naskah: GET /api/lontar-pages?lontar_id={id}
Route::get('lontar-pages', [LontarPageController::class, 'index']);
Route::get('lontar-pages/{id}', [LontarPageController::class, 'show']);

// Kategori & pembaca
Route::get('categories', [CategoryController::class, 'index']);
Route::get('readers', [ReaderController::class, 'index']);

// ─── Admin Routes (Protected with auth:sanctum) ────────────────────────────────
Route::prefix('admin')->middleware('auth:sanctum')->group(function () {

    // Manajemen Naskah
    Route::apiResource('lontars', LontarController::class)->except(['index', 'show']);

    // Manajemen Halaman/Lembar
    Route::apiResource('lontar-pages', LontarPageController::class)->except(['index', 'show']);

    // Upload audio rekaman langsung (dari MediaRecorder browser)
    Route::post('lontar-pages/{id}/audio', [LontarPageController::class, 'uploadAudio']);

    // Upload gambar enhanced (AI Edge Computing)
    Route::post('lontar-pages/{id}/enhanced', [LontarPageController::class, 'uploadEnhanced']);

    // Upload gambar (original + enhanced sekaligus)
    Route::post('lontar-pages/{id}/upload-images', [LontarPageController::class, 'uploadImages']);

    // Kategori & Pembaca
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('readers', ReaderController::class);
    Route::apiResource('audio', AudioRecordingController::class);
});
