<?php

namespace App\Http\Controllers;

use App\Models\RegistroPorrista;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class RegistroPorristaController extends Controller
{
    // * PERMISOS OTORGADOS
    public function __construct()
    {
        $this->middleware('permiso:consultar|usuario')->only(['index', 'show']);
        $this->middleware('permiso:agregar|usuario')->only('store');
        $this->middleware('permiso:actualizar|usuario')->only('update');
        $this->middleware('permiso:eliminar')->only('destroy');
    }

    //  * Mostrar todos los registros.
    public function index()
    {
        $user = Auth::user();

        if ($user->hasPermission('consultar')) {
            $registros = RegistroPorrista::with('pagos')->get();
        } else {
            $registros = RegistroPorrista::where('usuario_id', $user->id)->with('pagos')->get();
        }

        return response()->json($registros);
    }

    //  * Crear un nuevo registro.
    public function store(Request $request)
    {
        $dateString = preg_replace('/\s?\(.*\)$/', '', $request->fecha_nacimiento);
        $request['fecha_nacimiento'] = Carbon::parse($dateString);

        $data = $request->validate([
            'nombre' => 'required|string|max:20',
            'apellido_p' => 'required|string|max:30',
            'apellido_m' => 'required|string|max:30',
            'sexo' => 'required|in:hombre,mujer',
            'direccion' => 'required|string|max:500',
            'telefono' => 'required|string|max:15',
            'fecha_nacimiento' => 'required|date',
            'lugar_nacimiento' => 'required|string|max:255',
            'curp' => 'required|string|size:18|unique:registro_jugadores,curp',
            'grado_escolar' => 'required|in:primaria,secundaria,preparatoria',
            'nombre_escuela' => 'required|string|max:255',
            'alergias' => 'required|string|max:500',
            'padecimientos' => 'required|string|max:500',
            'peso' => 'required|numeric|min:1|max:500',
            'tipo_inscripcion' => 'required|in:novato,reinscripcion,transferencia,porrista',
            'foto_porrista' => 'required|string',
        ]);

        $data['usuario_id'] = Auth::id();
        $data['tipo_inscripcion'] = 'porrista';

        if($request->sexo === 'hombre'){
            return response()->json(['message' =>  'No se permiten porristas hombres'], 400);
        }

        $registro = RegistroPorrista::create($data);
        return response()->json(['message' =>  'Registro guardado correctamente', 'registro' => $registro], 201);
    }

    //  * Mostrar un solo registro por su ID.
    public function show($id)
    {
        $registro = RegistroPorrista::with('pagos')->find($id);

        if (!$registro) {
            return response()->json(['error' => 'Registro no encontrado'], 404);
        }

        if (Auth::user()->cannot('consultar') && $registro->usuario_id !== Auth::id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        return response()->json($registro);
    }

    //  * Actualizar un registro.
    public function update(Request $request, $id)
    {
        $registro = RegistroPorrista::find($id);

        if (!$registro) {
            return response()->json(['error' => 'Registro no encontrado'], 404);
        }

        if (Auth::user()->cannot('actualizar') && $registro->usuario_id !== Auth::id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $data = $request->validate([
            'nombre' => 'sometimes|string|max:20',
            'apellido_p' => 'sometimes|string|max:30',
            'apellido_m' => 'sometimes|string|max:30',
            'sexo' => 'sometimes|in:hombre,mujer',
            'direccion' => 'sometimes|string|max:500',
            'telefono' => 'sometimes|string|max:15',
            'fecha_nacimiento' => 'sometimes|date',
            'lugar_nacimiento' => 'sometimes|string|max:255',
            'curp' => 'sometimes|string|size:18|unique:registro_jugadores,curp,' . $id,
            'grado_escolar' => 'sometimes|in:primaria,secundaria,preparatoria',
            'nombre_escuela' => 'sometimes|string|max:255',
            'alergias' => 'sometimes|string|max:500',
            'padecimientos' => 'sometimes|string|max:500',
            'peso' => 'sometimes|numeric|min:1|max:500',
            'tipo_inscripcion' => 'sometimes|in:novato,reinscripcion,transferencia,porrista',
            'foto_porrista' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $data['tipo_inscripcion'] = 'porrista';

        if($request->sexo === 'hombre'){
            return response()->json(['message' =>  'No se permiten porristas hombres'], 400);
        }

        $registro->update($data);
        return response()->json(['message' => 'Registro actualizado'], 201);
    }

    //  * Eliminar un registro.
    public function destroy($id)
    {
        $registro = RegistroPorrista::find($id);

        if (!$registro) {
            return response()->json(['error' => 'Registro no encontrado'], 404);
        }

        $registro->delete();

        return response()->json(['message' => 'Registro eliminado con éxito']);
    }
}
