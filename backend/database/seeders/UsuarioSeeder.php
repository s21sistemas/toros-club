<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class UsuarioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('usuarios')->insert([
            ['nombre_completo' => 'Javier Salazar', 'celular' => '6181535898', 'ocupacion' => 'Desarrollador', 'correo' => 'javssala@gmail.com', 'contrasena' => bcrypt('12345678'), 'rol_id' => '1'],
        ]);
    }
}
