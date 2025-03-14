<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Documento extends Model
{
    use HasFactory;
    protected $table = 'documentos';

    protected $fillable = [
        'curp_jugador', 'ine_tutor', 'acta_nacimiento', 'comprobante_domicilio', 'firma', 'registro_jugador_id'
    ];

    protected $hidden = [
        'registro_jugador_id', 'curp_jugador', 'ine_tutor', 'acta_nacimiento', 'comprobante_domicilio', 'firma'
    ];

    protected $appends = ['curp_url', 'ine_url', 'acta_url', 'comprobante_url', 'firma_url'];

    public function jugador()
    {
        return $this->belongsTo(RegistroJugador::class, 'registro_jugador_id');
    }

    public function getCurpUrlAttribute()
    {
        return $this->generateUrl($this->curp_jugador);
    }

    public function getIneUrlAttribute()
    {
        return $this->generateUrl($this->ine_tutor);
    }

    public function getActaUrlAttribute()
    {
        return $this->generateUrl($this->acta_nacimiento);
    }

    public function getComprobanteUrlAttribute()
    {
        return $this->generateUrl($this->comprobante_domicilio);
    }

    public function getFirmaUrlAttribute()
    {
        return $this->generateUrl($this->firma);
    }

    private function generateUrl($filename)
    {
        if (!$filename || !$this->jugador) {
            return null;
        }

        $subcarpeta = $this->jugador->usuario_id . '/' . $this->jugador->curp;
        return asset("storage/documentos_registro_jugadores/{$subcarpeta}/{$filename}");
    }

    public function scopeDelUsuario($query, $usuarioId)
    {
        return $query->whereIn('registro_jugador_id', function ($subQuery) use ($usuarioId) {
            $subQuery->select('id')->from('registro_jugadores')->where('usuario_id', $usuarioId);
        });
    }
}
