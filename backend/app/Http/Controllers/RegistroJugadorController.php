<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Models\Usuario;
use App\Models\RegistroJugador;
use App\Models\RegistroPorrista;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class RegistroJugadorController extends Controller
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
            $registros = RegistroJugador::with(['documentos', 'pagos', 'transferencias'])->get();
        } else {
            $registros = RegistroJugador::where('usuario_id', $user->id)->with(['documentos', 'pagos', 'transferencias'])->get();
        }

        $registros->each(function ($jugador) {
            $jugador->documentos->each->makeHidden('jugador');
        });

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
            'foto_jugador' => 'required|string',
        ]);

        $data['usuario_id'] = Auth::id();

        if($request->sexo === 'mujer' && $request->tipo_inscripcion === 'porrista'){
            $data['foto_porrista'] = $data['foto_jugador'];
            unset($data['foto_jugador']);
            $registro = RegistroPorrista::create($data);

            return response()->json(['message' =>  'Registro guardado correctamente', 'registro' => $registro], 201);
        }elseif($request->sexo === 'hombre' && $request->tipo_inscripcion === 'porrista'){
            return response()->json(['message' =>  'No se permiten porristas hombres'], 400);
        }

        $categoria = Categoria::determinarCategoria($data['sexo'], $data['fecha_nacimiento']);

        if (!$categoria) {
            return response()->json(['error' => 'No se encontró una categoría para el jugador'], 400);
        }else {
            $categoria_peso = $categoria->nombre === 'JR' || $categoria->nombre === 'MG' || $categoria->nombre === 'PW';
            if ($categoria_peso && ($data['peso'] < $categoria->peso_minimo || $data['peso'] > $categoria->peso_maximo)) {
                return response()->json(['error' => 'El peso y/o la edad, no corresponde con ninguna categoría válida.'], 400);
            }
        }

        $data['categoria_id'] = $categoria->id;
        $registro = RegistroJugador::create($data);

        return response()->json(['message' =>  'Registro guardado correctamente', 'registro' => $registro], 201);
    }

    //  * Mostrar un solo registro por su ID.
    public function show($id)
    {
        $registro = RegistroJugador::with(['documentos', 'pagos', 'transferencias'])->find($id);

        if (!$registro) {
            return response()->json(['error' => 'Registro no encontrado'], 404);
        }

        if (Auth::user()->cannot('consultar') && $registro->usuario_id !== Auth::id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $registro->documentos->makeHidden('jugador');

        return response()->json($registro->append('foto_url'));
    }

    //  * Actualizar un registro.
    public function update(Request $request, $id)
    {
        $registro = RegistroJugador::find($id);

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
            'tipo_inscripcion' => 'sometimes|in:novato,reinscripcion,transferencia',
            'foto_jugador' => 'sometimes|string',
        ]);

        // if ($request->hasFile('foto_jugador')) {
        //     $carpeta = $registro->usuario_id . '/' . $registro->curp;
        //     if ($registro->foto_jugador) {
        //         $this->eliminarFoto($carpeta, $registro->foto_jugador);
        //     }

        //     if($request->curp){
        //         $carpeta = $registro->usuario_id . '/' . $request->curp;
        //     }

        //     $data['foto_jugador'] = $this->subirFoto($request->file('foto_jugador'), $carpeta);
        // }

        $registro->update($data);

        return response()->json(['message' => 'Registro actualizado'], 201);
    }

    //  * Eliminar un registro.
    public function destroy($id)
    {
        $registro = RegistroJugador::find($id);

        if (!$registro) {
            return response()->json(['error' => 'Registro no encontrado'], 404);
        }

        // if ($registro->foto_jugador) {
        //     $carpeta = $registro->usuario_id . '/' . $registro->curp;
        //     $this->eliminarFoto($carpeta, $registro->foto_jugador);
        // }

        $registro->delete();

        return response()->json(['message' => 'Registro eliminado con éxito']);
    }

    // * Función para subir una foto
    private function subirFoto($archivo, $carpeta)
    {
        $nombre = time() . '_' . uniqid() . '.' . $archivo->extension();
        $archivo->storeAs('public/fotos_registro_jugadores/' . $carpeta, $nombre);
        return $nombre;
    }

    // * Función para eliminar una foto
    private function eliminarFoto($carpeta, $nombre)
    {
        Storage::delete('public/fotos_registro_jugadores/' . $carpeta . '/' . $nombre);
    }

    public function searchJugador($curp)
    {
        $registro = RegistroJugador::where('curp', $curp)->first();

        if (!$registro) {
            return response()->json(['error' => 'Registro no encontrado'], 404);
        }

        return response()->json($registro);
    }
}
