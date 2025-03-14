<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PagoNTR extends Model
{
    use HasFactory;
    protected $table = 'pagos_ntr';

    protected $fillable = [
        'inscripcion', 'tunel', 'botiquin', 'coacheo_semanal', 'registro_jugador_id'
    ];

    protected $hidden = [
        'registro_jugador_id',
    ];

    public function jugador()
    {
        return $this->belongsTo(RegistroJugador::class, 'registro_jugador_id');
    }

    public function scopeDelUsuario($query, $usuarioId)
    {
        return $query->whereIn('registro_jugador_id', function ($subQuery) use ($usuarioId) {
            $subQuery->select('id')->from('registro_jugadores')->where('usuario_id', $usuarioId);
        });
    }
}
