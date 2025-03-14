<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegistroPorrista extends Model
{
    use HasFactory;

    protected $table = 'registro_porristas';
    public $timestamps = false;

    protected $fillable = [
        'nombre', 'apellido_p', 'apellido_m', 'sexo', 'direccion', 'telefono',
        'fecha_nacimiento', 'lugar_nacimiento', 'curp', 'grado_escolar',
        'nombre_escuela', 'alergias', 'padecimientos', 'peso', 'tipo_inscripcion', 'foto_porrista', 'usuario_id'
    ];

    protected $hidden = [
        'usuario_id',
        'foto_porrista',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }

    public function getFotoUrlAttribute()
    {
        $sin_foto = asset('storage/fotos_registro_porristas/default.png');
        $foto = asset('storage/fotos_registro_porristas/'. $this->usuario_id . '/' . $this->foto_porrista);

        return $this->foto_porrista ? $foto : $sin_foto;
    }
}
