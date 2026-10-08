<?php

use Illuminate\Database\QueryException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );

        // Handle database connection errors with a friendly message
        $exceptions->render(function (QueryException $e, Request $request) {
            if ($request->is('api/*')) {
                // MySQL connection refused (error code 2002)
                if ($e->getCode() == 2002 || str_contains($e->getMessage(), 'Connection refused') || str_contains($e->getMessage(), 'No connection could be made')) {
                    return response()->json([
                        'message' => 'Database tidak dapat dihubungi. Pastikan MySQL/XAMPP sudah berjalan.',
                        'error'   => 'db_connection_error',
                    ], 503);
                }
                // Other query errors (e.g. duplicate entry that slipped through)
                return response()->json([
                    'message' => 'Terjadi kesalahan database: ' . $e->getMessage(),
                    'error'   => 'db_query_error',
                ], 500);
            }
        });
    })->create();
