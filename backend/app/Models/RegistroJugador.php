<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegistroJugador extends Model
{
    use HasFactory;

    protected $table = 'registro_jugadores';
    public $timestamps = false;

    protected $fillable = [
        'nombre', 'apellido_p', 'apellido_m', 'sexo', 'direccion', 'telefono',
        'fecha_nacimiento', 'lugar_nacimiento', 'curp', 'grado_escolar',
        'nombre_escuela', 'alergias', 'padecimientos', 'peso', 'tipo_inscripcion', 'foto_jugador', 'usuario_id', 'categoria_id'
    ];

    protected $hidden = [
        'usuario_id',
        'categoria_id',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }

    public function getFotoUrlAttribute()
    {
        $sin_foto = asset('storage/fotos_registro_jugadores/default.png');
        $carpeta = $this->usuario_id . '/' . $this->curp . '/' . $this->foto_jugador;
        $foto = asset('storage/fotos_registro_jugadores/'. $carpeta);

        return $this->foto_jugador ? $foto : $sin_foto;
    }

    public function categoria() {
        return $this->belongsTo(Categoria::class);
    }

    public function documentos()
    {
        return $this->hasMany(Documento::class, 'registro_jugador_id');
    }

    public function transferencias()
    {
        return $this->hasMany(TransferenciaJugador::class, 'registro_jugador_id');
    }

    public function pagos()
    {
        return $this->hasMany(PagoNTR::class, 'registro_jugador_id');
    }
}
