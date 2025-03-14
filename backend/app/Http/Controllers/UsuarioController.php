<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use App\Mail\RegistroMailable;
use Illuminate\Support\Facades\Mail;

class UsuarioController extends Controller
{
    // * PERMISOS OTORGADOS
    public function __construct()
    {
        $this->middleware('permiso:consultar')->only(['index', 'show']);
        $this->middleware('permiso:agregar')->only('store');
        $this->middleware('permiso:actualizar')->only('update');
        $this->middleware('permiso:eliminar')->only('destroy');
    }

    //  * Mostrar todos los usuarios con sus roles.
    public function index()
    {
        $usuarios = Usuario::with('rol')->get();
        return response()->json($usuarios);
    }

    //  * Crear un nuevo registro.
    public function store(Request $request)
    {
        $request->validate([
            'nombre_completo' => 'required|string|max:255',
            'celular' => 'required|string|max:15',
            'ocupacion' => 'required|string|max:100',
            'correo' => 'required|email|unique:usuarios,correo',
            'contrasena' => 'required|string|min:6',
            'rol_id' => 'required|exists:roles,id',
        ]);

        $usuario = new Usuario;

        $usuario = Usuario::create([
            'nombre_completo' => $request->nombre_completo,
            'celular' => $request->celular,
            'ocupacion' => $request->ocupacion,
            'correo' => $request->correo,
            'contrasena' => $request->contrasena,
            'rol_id' => $request->rol_id,
        ]);

        return response()->json(['message' => 'Usuario registrado'], 201);
    }

    //  * Mostrar un solo registro por su ID.
    public function show($id)
    {
        $usuario = Usuario::with('rol')->find($id);

        if (!$usuario) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }

        return response()->json($usuario);
    }

    //  * Actualizar un registro.
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
            'rol_id' => 'sometimes|exists:roles,id',
        ]);

        $usuario->update($request->all());

        return response()->json(['message' => 'Usuario actualizado'], 201);
    }

    //  * Eliminar un registro.
    public function destroy($id)
    {
        $usuario = Usuario::find($id);

        if (!$usuario) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }

        $usuario->delete();

        return response()->json(['message' => 'Usuario eliminado con éxito']);
    }

    // * Pre registro
    public function registro(Request $request)
    {
        $request->validate([
            'nombre_completo' => 'required|string|max:255',
            'celular' => 'required|string|max:15',
            'ocupacion' => 'required|string|max:100',
            'correo' => 'required|email|unique:usuarios,correo',
        ]);

        $codigo = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $data = [
            'nombre_completo' => $request->nombre_completo,
            'celular' => $request->celular,
            'ocupacion' => $request->ocupacion,
            'correo' => $request->correo,
            'contrasena' => $codigo,
        ];

        $usuario = Usuario::create(array_merge($data, [ 'rol_id' => 4 ]));

        Mail::to($request->correo)->send(new RegistroMailable($data));

        return response()->json(['message' => 'Usuario registrado'], 201);
    }
}