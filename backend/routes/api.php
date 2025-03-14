<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\RolController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PerfilController;
use App\Http\Controllers\RegistroJugadorController;
use App\Http\Controllers\DocumentoController;
use App\Http\Controllers\TransferenciaJugadorController;
use App\Http\Controllers\PagoNTRController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/login', [AuthController::class, 'login']);
Route::post('/registro', [UsuarioController::class, 'registro']);

Route::middleware('auth:sanctum')->group(function () {

    Route::apiResource('roles', RolController::class);
    Route::apiResource('usuarios', UsuarioController::class);
    Route::apiResource('perfil', PerfilController::class);
    Route::apiResource('registro-jugadores', RegistroJugadorController::class);
    Route::apiResource('documentos', DocumentoController::class);
    Route::apiResource('transferencia-jugadores', TransferenciaJugadorController::class);
    Route::apiResource('pagos-ntr', PagoNTRController::class);

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);
});
