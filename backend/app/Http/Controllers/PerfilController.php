<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuario;

class PerfilController extends Controller
{
    //  * Mostrar perfil.
    public function index(Request $request)
    {
        $usuario = Usuario::with('rol')->find($request->user()->id);

        if (!$usuario) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }

        $usuario->jugadores_registrados = $usuario->hasPermission('usuario')
            ? $usuario->registrosJugadores()->with(['documentos', 'pagos', 'transferencias'])->get()->append('foto_url')
            : [];

        $usuario->jugadores_registrados->each(function ($jugador) {
            $jugador->documentos->each->makeHidden('jugador');
        });

        return response()->json($usuario);
    }

    //  * Actualizar perfil.
    public function update(Request $request, $id)
    {
        $usuario = Usuario::find($id);

        if (!$usuario) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }

        $request->validate([
            'nombre_completo' => 'sometimes|string|max:255',
            'celular' => 'sometimes|string|max:15',
            'ocupacion' => 'sometimes|string|max:100',
            'correo' => 'sometimes|email|unique:usuarios,correo,' . $id,
            'contrasena' => 'sometimes|string|min:6',
        ]);

        $usuario->update($request->all());

        return response()->json(['message' => 'Perfil actualizado'], 201);
    }
}
