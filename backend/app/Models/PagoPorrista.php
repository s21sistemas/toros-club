<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PagoPorrista extends Model
{
    use HasFactory;
    protected $table = 'pagos_porristas';

    protected $fillable = [
        'inscripcion', 'coacheo_semanal', 'registro_porrista_id'
    ];

    protected $hidden = [
        'registro_porrista_id',
    ];

    public function porrista()
    {
        return $this->belongsTo(RegistroPorrista::class, 'registro_porrista_id');
    }

    public function scopeDelUsuario($query, $usuarioId)
    {
        return $query->whereIn('registro_porrista_id', function ($subQuery) use ($usuarioId) {
            $subQuery->select('id')->from('registro_porristas')->where('usuario_id', $usuarioId);
        });
    }
}
