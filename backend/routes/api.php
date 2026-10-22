<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\VehiculoController;
use App\Http\Controllers\Api\ReservaController;
use App\Http\Controllers\Api\ClienteController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\FinanzasController;
use App\Http\Controllers\Api\LogClienteController;
use App\Http\Controllers\Api\BigoneReservaController;
use App\Http\Controllers\Api\BigoneIntentoController;
use App\Http\Controllers\Api\BigoneAdminLogController;
use App\Http\Controllers\Api\TiktokVideoController;
use App\Http\Controllers\Api\BigoneDocController;
use App\Http\Controllers\Api\BigoneGarantiaController;
use App\Http\Controllers\Api\UsuariosController;
use App\Http\Controllers\Api\SettingsController;
use Illuminate\Support\Facades\Route;

// --- público ---
Route::get('/settings',                   [SettingsController::class, 'index']);
Route::get('/tiktok-videos',              [TiktokVideoController::class, 'index']);
Route::get('/vehiculos', [VehiculoController::class, 'index']);
Route::get('/vehiculos/{id}', [VehiculoController::class, 'show']);
Route::get('/vehiculos/{id}/disponibilidad', [VehiculoController::class, 'disponibilidad']);
Route::post('/reservas', [ReservaController::class, 'store']);
Route::post('/log-cliente', [LogClienteController::class, 'store']);

// --- bigone: público (frontend llama sin auth) ---
Route::post('/bigone/reservas',           [BigoneReservaController::class, 'store']);
Route::post('/bigone/intentos',           [BigoneIntentoController::class, 'store']);
Route::patch('/bigone/intentos/{refId}/completar', [BigoneIntentoController::class, 'completar']);
Route::get('/bigone/cliente',             [BigoneReservaController::class, 'buscarPorCi']);
Route::post('/bigone/upload-doc',         [BigoneDocController::class, 'store']);
Route::post('/bigone/garantias',          [BigoneGarantiaController::class, 'store']);

// --- auth ---
Route::post('/admin/login', [AuthController::class, 'login']);

// --- admin (protegido) ---
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::apiResource('vehiculos', VehiculoController::class);
    Route::post('/vehiculos/upload-imagen', [VehiculoController::class, 'uploadImagen']);

    Route::get('/usuarios',           [UsuariosController::class, 'index']);
    Route::post('/usuarios',          [UsuariosController::class, 'store']);
    Route::patch('/usuarios/{id}',    [UsuariosController::class, 'update']);
    Route::delete('/usuarios/{id}',   [UsuariosController::class, 'destroy']);

    Route::patch('/settings',         [SettingsController::class, 'update']);

    Route::apiResource('reservas',  ReservaController::class)->only(['index','show','update','destroy']);
    Route::patch('/reservas/{id}',  [ReservaController::class, 'update']);
    Route::get('/clientes',         [ClienteController::class, 'index']);
    Route::get('/clientes/{id}',    [ClienteController::class, 'show']);
    Route::delete('/clientes/{id}', [ClienteController::class, 'destroy']);

    Route::get('/finanzas/resumen',              [FinanzasController::class, 'resumen']);
    Route::get('/finanzas/ingresos',             [FinanzasController::class, 'ingresos']);
    Route::get('/finanzas/garantias',            [FinanzasController::class, 'garantias']);
    Route::post('/finanzas/garantias',           [FinanzasController::class, 'storeGarantia']);
    Route::patch('/finanzas/garantias/{id}',     [FinanzasController::class, 'devolverGarantia']);
    Route::delete('/finanzas/garantias/{id}',    [FinanzasController::class, 'destroyGarantia']);

    // --- bigone admin (protegido) ---
    Route::get('/bigone/reservas',                    [BigoneReservaController::class, 'index']);
    Route::patch('/bigone/reservas/{id}',             [BigoneReservaController::class, 'update']);
    Route::delete('/bigone/reservas/{id}',            [BigoneReservaController::class, 'destroy']);
    Route::post('/bigone/reservas/{id}/restaurar',    [BigoneReservaController::class, 'restore']);
    Route::delete('/bigone/reservas/{id}/forzar',     [BigoneReservaController::class, 'forceDelete']);
    Route::get('/bigone/reservas/export',             [BigoneReservaController::class, 'export']);

    Route::get('/bigone/intentos',            [BigoneIntentoController::class, 'index']);
    Route::delete('/bigone/intentos/{id}',    [BigoneIntentoController::class, 'destroy']);

    Route::get('/bigone/logs',                [BigoneAdminLogController::class, 'index']);

    Route::get('/bigone/garantias',           [BigoneGarantiaController::class, 'index']);
    Route::patch('/bigone/garantias/{id}',    [BigoneGarantiaController::class, 'update']);
    Route::delete('/bigone/garantias/{id}',   [BigoneGarantiaController::class, 'destroy']);

    Route::get('/tiktok-videos',              [TiktokVideoController::class, 'index']);
    Route::post('/tiktok-videos',             [TiktokVideoController::class, 'store']);
    Route::delete('/tiktok-videos/{tiktokVideo}', [TiktokVideoController::class, 'destroy']);
});
