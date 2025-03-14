<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    protected $table = 'usuarios';
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nombre_completo',
        'celular',
        'ocupacion',
        'correo',
        'contrasena',
        'rol_id'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'rol_id', 'contrasena', 'remember_token',
    ];

    public function setContrasenaAttribute($value)
    {
        $this->attributes['contrasena'] = bcrypt($value);
    }

    public function rol()
    {
        return $this->belongsTo(Rol::class, 'rol_id');
    }

    public function registrosJugadores()
    {
        return $this->hasMany(RegistroJugador::class, 'usuario_id');
    }

    public function hasPermission($permission)
    {
        if ($this->rol && in_array($permission, explode(',', $this->rol->permisos))) {
            return true;
        }

        return false;
    }
}
