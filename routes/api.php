<?php

use App\Http\Controllers\UploadController;
use Illuminate\Support\Facades\Route;

// Served under /api automatically. The public archive pages live in web.php;
// these endpoints exist for the family sites and future apps.
Route::get('/health', [UploadController::class, 'health']);
Route::get('/lontars', [UploadController::class, 'index']);
