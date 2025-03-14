<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class RolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('roles')->insert([
            ['nombre' => 'Super admin', 'permisos' => 'consultar,agregar,actualizar,eliminar'],
            ['nombre' => 'Administrador', 'permisos' => 'consultar,agregar,actualizar'],
            ['nombre' => 'Consultor', 'permisos' => 'consultar'],
            ['nombre' => 'Usuario', 'permisos' => 'usuario'],
            ['nombre' => 'Coach', 'permisos' => 'coach'],
        ]);
    }
}
