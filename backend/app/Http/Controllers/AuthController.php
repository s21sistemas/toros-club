<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Usuario;

class AuthController extends Controller
{
    // * Método para logearse
    public function login(Request $request)
    {
        $request->validate([
            'correo' => 'required|email',
            'contrasena' => 'required|string'
        ]);

        $usuario = Usuario::with('rol')->where('correo', $request->correo)->first();

        if (!$usuario || !Hash::check($request->contrasena, $usuario->contrasena)) {
            return response()->json(['error' => 'Credenciales incorrectas'], 401);
        }

        $usuario->tokens()->delete();

        $token = $usuario->createToken('auth_token')->plainTextToken;

        $usuario->jugadores_registrados = $usuario->hasPermission('jugador')
            ? $usuario->registrosJugadores()->with(['documentos', 'pagos', 'transferencias'])->get()->append('foto_url')
            : [];

        return response()->json([
            'message' => 'Login exitoso',
            'usuario' => $usuario,
            'token' => $token
        ]);
    }

    // * Método para cerrar sesión
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Sesión cerrada correctamente']);
    }
}
