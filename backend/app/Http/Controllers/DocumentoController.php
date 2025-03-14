<?php

namespace App\Http\Controllers;

use App\Models\RegistroJugador;
use App\Models\Documento;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentoController extends Controller
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

        $documentos = $user->hasPermission('consultar')
        ? Documento::with('jugador')->get()
        : Documento::with('jugador')->delUsuario($user->id)->get();

        return response()->json($documentos);
    }

    //  * Crear un nuevo registro.
    public function store(Request $request)
    {
        $data = $request->validate([
            'registro_jugador_id' => 'required|exists:registro_jugadores,id',
            'curp_jugador' => 'required|mimes:pdf|max:2048',
            'ine_tutor' => 'required|mimes:pdf|max:2048',
            'acta_nacimiento' => 'required|mimes:pdf|max:2048',
            'comprobante_domicilio' => 'required|mimes:pdf|max:2048',
            // 'firma' => 'required|mimes:pdf|max:2048',
        ]);

        $registro = RegistroJugador::where('id', $data['registro_jugador_id'])
        ->where('usuario_id', Auth::id())
        ->first();

        $carpeta = Auth::id() . '/' . $registro->curp;
        $data = array_merge($data, $this->subirArchivos($request, $carpeta));

        Documento::create($data);

        return response()->json(['message' =>  'Registro guardado'], 201);
     }

    //  * Mostrar un solo registro por su ID.
    public function show($id)
    {
        $documento = Documento::find($id);

        if (!$documento) {
            return response()->json(['error' => 'Registro no encontrado'], 404);
        }

        $registro = $documento->jugador;
        if (Auth::user()->cannot('consultar') && $registro->usuario_id !== Auth::id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        return response()->json($documento);
    }

    //  * Actualizar un registro.
    public function update(Request $request, $id)
    {
        $documento = Documento::find($id);

        if (!$documento) {
            return response()->json(['error' => 'Registro no encontrado'], 404);
        }

        $registro = $documento->jugador;
        if (Auth::user()->cannot('actualizar') && $registro->usuario_id !== Auth::id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $data = $request->validate([
            'curp_jugador' => 'sometimes|mimes:pdf|max:2048',
            'ine_tutor' => 'sometimes|mimes:pdf|max:2048',
            'acta_nacimiento' => 'sometimes|mimes:pdf|max:2048',
            'comprobante_domicilio' => 'sometimes|mimes:pdf|max:2048',
            // 'firma' => 'sometimes|mimes:pdf|max:2048',
        ]);

        foreach (['curp_jugador', 'ine_tutor', 'acta_nacimiento', 'comprobante_domicilio'] as $campo) {
            if ($request->hasFile($campo)) {
                $carpeta = $registro->usuario_id . '/' . $registro->curp;

                if ($documento->$campo) {
                    $this->eliminarArchivo($carpeta, $documento->$campo);
                }

                $data[$campo] = $this->subirArchivo($request->file($campo), $carpeta);
            }
        }

        $documento->update($data);

        return response()->json(['message' => 'Registro actualizado'], 201);
    }

    //  * Eliminar un registro.
    public function destroy($id)
    {
        $documento = Documento::find($id);

        if (!$documento) {
            return response()->json(['error' => 'Registro no encontrado'], 404);
        }

        $registroUsuarioId = $documento->jugador->usuario_id ?? null;
        if ($registroUsuarioId) {
            $carpeta = $registroUsuarioId . '/' . $documento->jugador->curp;
            Storage::deleteDirectory("public/documentos_registro_jugadores/$carpeta");
        }

        $documento->delete();

        return response()->json(['message' => 'Registro eliminado'], 201);
    }

    // * Función para subir archivos
    private function subirArchivos(Request $request, $carpeta)
    {
        $archivos = ['curp_jugador', 'ine_tutor', 'acta_nacimiento', 'comprobante_domicilio'];
        $data = [];

        foreach ($archivos as $campo) {
            if ($request->hasFile($campo)) {
                $data[$campo] = $this->subirArchivo($request->file($campo), $carpeta);
            }
        }

        return $data;
    }

    // * Función para subir archivo
    private function subirArchivo($archivo, $carpeta)
    {
        $nombre = time() . '_' . uniqid() . '.' . $archivo->extension();
        $archivo->storeAs('public/documentos_registro_jugadores/' . $carpeta, $nombre);

        return $nombre;
    }

    // * Función para eliminar archivos
    private function eliminarArchivo($carpeta, $nombre)
    {
        Storage::delete('public/documentos_registro_jugadores/' . $carpeta . '/' . $nombre);
    }
}
