<?php

namespace App\Http\Controllers;

use App\Models\Rol;
use Illuminate\Http\Request;

class RolController extends Controller
{
    // * PERMISOS OTORGADOS
    public function __construct()
    {
        $this->middleware('permiso:consultar')->only(['index', 'show']);
        $this->middleware('permiso:agregar')->only('store');
        $this->middleware('permiso:actualizar')->only('update');
        $this->middleware('permiso:eliminar')->only('destroy');
    }

    //  * Mostrar todos los registros.
    public function index()
    {
        $roles = Rol::get();
        return response()->json($roles);
    }

    //  * Crear un nuevo registro.
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:100|unique:roles,nombre',
            'permisos' => 'required|string',
        ]);

        $rol = Rol::create([
            'nombre' => $request->nombre,
            'permisos' => $request->permisos,
        ]);

        return response()->json(['message' => 'Rol guardado'], 201);
    }

    //  * Mostrar un solo registro por su ID.
    public function show($id)
    {
        $rol = Rol::find($id);

        if (!$rol) {
            return response()->json(['error' => 'Rol no encontrado'], 404);
        }

        return response()->json($rol);
    }

    //  * Actualizar un registro.
    public function update(Request $request, $id)
    {
        $rol = Rol::find($id);

        if (!$rol) {
            return response()->json(['error' => 'Rol no encontrado'], 404);
        }

        $request->validate([
            'nombre' => 'sometimes|string|max:100|unique:roles,nombre,' . $id,
            'permisos' => 'sometimes|string',
        ]);

        $rol->update($request->all());

        return response()->json(['message' => 'Rol actualizado'], 201);
    }

    //  * Eliminar un registro.
    public function destroy($id)
    {
        $rol = Rol::find($id);

        if (!$rol) {
            return response()->json(['error' => 'Rol no encontrado'], 404);
        }

        $rol->delete();

        return response()->json(['message' => 'Rol eliminado con éxito']);
    }
}