<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransferenciaJugador extends Model
{
    use HasFactory;
    protected $table = 'transferencias_jugadores';

    protected $fillable = [
        'club_anterior', 'temporadas_jugadas', 'motivo_transferencia', 'registro_jugador_id'
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
