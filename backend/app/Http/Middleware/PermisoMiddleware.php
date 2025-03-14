<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PermisoMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next, $permiso)
    {
        $usuario = Auth::user();

        if (!$usuario || !$usuario->rol) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $permisos = explode(',', $usuario->rol->permisos);
        $permisosRequeridos = explode('|', $permiso);
        $permisosEncontrados = array_intersect($permisosRequeridos, $permisos);

        if (empty($permisosEncontrados)) {
            return response()->json(['error' => 'Permiso denegado'], 403);
        }

        return $next($request);
    }
}