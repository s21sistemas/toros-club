<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Categoria extends Model
{
    use HasFactory;
    protected $table = 'categorias';

    protected $fillable = [
        'nombre', 'peso_minimo', 'peso_maximo', 'tipo'
    ];

    public static function determinarCategoria($sexo, $fechaNacimiento)
    {
        $fechaNacimiento = Carbon::parse($fechaNacimiento);
        $añoActual = now()->year;
        $edad = $añoActual - $fechaNacimiento->year;
        $mesNacimiento = $fechaNacimiento->month;
        $añoNacimiento = $fechaNacimiento->year;

        if ($sexo === 'hombre') {
            if ($añoNacimiento == ($añoActual - 17) || ($añoNacimiento == ($añoActual - 16) && $mesNacimiento <= 6)) {
                return self::obtenerCategoria('BT', 'juvenil');
            } elseif (($añoNacimiento == ($añoActual - 16) && $mesNacimiento >= 7) || ($añoNacimiento == ($añoActual - 15) && $mesNacimiento <= 12)) {
                return self::obtenerCategoria('JR', 'juvenil');
            } elseif (($añoNacimiento == ($añoActual - 14) && $mesNacimiento >= 1) || ($añoNacimiento == ($añoActual - 13) && $mesNacimiento <= 6)) {
                return self::obtenerCategoria('MG', 'juvenil');
            } elseif (($añoNacimiento == ($añoActual - 13) && $mesNacimiento >= 7) || ($añoNacimiento == ($añoActual - 12) && $mesNacimiento <= 12)) {
                return self::obtenerCategoria('PW', 'juvenil');
            }

            if ($añoNacimiento == ($añoActual - 11) || ($añoNacimiento == ($añoActual - 10) && $mesNacimiento <= 6)) {
                return self::obtenerCategoria('As', 'flag_infantil_varonil');
            } elseif (($añoNacimiento == ($añoActual - 10) && $mesNacimiento >= 7) || ($añoNacimiento == ($añoActual - 9) && $mesNacimiento <= 12)) {
                return self::obtenerCategoria('Hs', 'flag_infantil_varonil');
            } elseif (($añoNacimiento == ($añoActual - 8) && $mesNacimiento >= 1) || ($añoNacimiento == ($añoActual - 7) && $mesNacimiento <= 6)) {
                return self::obtenerCategoria('js', 'flag_infantil_varonil');
            } elseif (($añoNacimiento == ($añoActual - 7) && $mesNacimiento >= 7) || ($añoNacimiento == ($añoActual - 6) && $mesNacimiento <= 12)) {
                return self::obtenerCategoria('Ms (NC)', 'flag_infantil_varonil');
            }

        } elseif ($sexo === 'mujer') {
            if ($edad === 17 || $edad === 16) {
                return self::obtenerCategoria('Master Flag', 'flag_femenil');
            } elseif ($edad === 15 || $edad === 14) {
                return self::obtenerCategoria('Flag Junior', 'flag_femenil');
            } elseif ($edad === 13 || $edad === 12) {
                return self::obtenerCategoria('Flag Juvenil', 'flag_femenil');
            } elseif ($edad === 11 || $edad === 10) {
                return self::obtenerCategoria('Flag Infantil', 'flag_femenil');
            } elseif ($edad === 9 || $edad === 8) {
                return self::obtenerCategoria('Baby Flag', 'flag_femenil');
            } elseif ($edad === 7 || $edad === 6) {
                return self::obtenerCategoria('Mini Flag (N/C)', 'flag_femenil');
            }
        }

        return null;
    }

    private static function obtenerCategoria($nombre, $tipo)
    {
        return self::where('nombre', $nombre)->where('tipo', $tipo)->first();
    }
}
