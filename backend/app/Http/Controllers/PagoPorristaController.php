<?php

namespace App\Http\Controllers;

use App\Models\PagoPorrista;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class PagoPorristaController extends Controller
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

        $pagos = $user->hasPermission('consultar')
        ? PagoPorrista::with('jugador')->get()
        : PagoPorrista::with('jugador')->delUsuario($user->id)->get();

        return response()->json($pagos);
    }

    //  * Crear un nuevo registro.
    public function store(Request $request)
    {
        $data = $request->validate([
            'inscripcion' => 'required|boolean',
            'coacheo_semanal' => 'required|boolean',
            'registro_jugador_id' => 'required|exists:registro_jugadores,id',
        ]);

        PagoPorrista::create($data);

        return response()->json(['message' =>  'Registro guardado'], 201);
     }

    //  * Mostrar un solo registro por su ID.
    public function show($id)
    {
        $pago = PagoPorrista::with('jugador')->find($id);

        if (!$pago) {
            return response()->json(['error' => 'Registro no encontrado'], 404);
        }

        return response()->json($pago);
    }

    //  * Actualizar un registro.
    public function update(Request $request, $id)
    {
        $pago = PagoPorrista::find($id);

        if (!$pago) {
            return response()->json(['error' => 'Registro no encontrado'], 404);
        }

        $data = $request->validate([
            'inscripcion' => 'sometimes|boolean',
            'coacheo_semanal' => 'sometimes|boolean',
        ]);

        $pago->update($data);

        return response()->json(['message' => 'Registro actualizado'], 201);
    }

    //  * Eliminar un registro.
    public function destroy($id)
    {
        $pago = PagoPorrista::find($id);

        if (!$pago) {
            return response()->json(['error' => 'Registro no encontrado'], 404);
        }

        $pago->delete();

        return response()->json(['message' => 'Registro eliminado'], 201);
    }
}
