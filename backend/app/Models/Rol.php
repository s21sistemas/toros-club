<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{
    use HasFactory;

    protected $table = 'roles';
    public $timestamps = false;

    protected $fillable = ['nombre', 'permisos'];
    protected $hidden = ['id'];

    public function usuarios()
    {
        return $this->hasMany(Usuario::class, 'rol_id');
    }
}