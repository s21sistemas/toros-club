<?php

namespace App\Http\Controllers;

use App\Models\TransferenciaJugador;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class TransferenciaJugadorController extends Controller
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

        $transferencias = $user->hasPermission('consultar')
        ? TransferenciaJugador::with('jugador')->get()
        : TransferenciaJugador::with('jugador')->delUsuario($user->id)->get();

        return response()->json($transferencias);
    }

    //  * Crear un nuevo registro.
    public function store(Request $request)
    {
        $data = $request->validate([
            'club_anterior' => 'required|string',
            'temporadas_jugadas' => 'required|integer|min:1',
            'motivo_transferencia' => 'required|string',
            'registro_jugador_id' => 'required|exists:registro_jugadores,id',
        ]);

        TransferenciaJugador::create($data);

        return response()->json(['message' =>  'Registro guardado'], 201);
     }

    //  * Mostrar un solo registro por su ID.
    public function show($id)
    {
        $transferencia = TransferenciaJugador::with('jugador')->find($id);

        if (!$transferencia) {
            return response()->json(['error' => 'Registro no encontrado'], 404);
        }

        return response()->json($transferencia);
    }

    //  * Actualizar un registro.
    public function update(Request $request, $id)
    {
        $transferencia = TransferenciaJugador::find($id);

        if (!$transferencia) {
            return response()->json(['error' => 'Registro no encontrado'], 404);
        }

        $data = $request->validate([
            'club_anterior' => 'sometimes|string',
            'temporadas_jugadas' => 'sometimes|integer|min:1',
            'motivo_transferencia' => 'sometimes|string',
        ]);

        $transferencia->update($data);

        return response()->json(['message' => 'Registro actualizado'], 201);
    }

    //  * Eliminar un registro.
    public function destroy($id)
    {
        $transferencia = TransferenciaJugador::find($id);

        if (!$transferencia) {
            return response()->json(['error' => 'Registro no encontrado'], 404);
        }

        $transferencia->delete();

        return response()->json(['message' => 'Registro eliminado'], 201);
    }
}
