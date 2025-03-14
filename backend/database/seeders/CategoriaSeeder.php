<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class CategoriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('categorias')->insert([
            // Juvenil Equipado
            ['nombre' => 'BT', 'peso_minimo' => null, 'peso_maximo' => null, 'tipo' => 'juvenil'], // Libre
            ['nombre' => 'JR', 'peso_minimo' => 54, 'peso_maximo' => 88, 'tipo' => 'juvenil'],
            ['nombre' => 'MG', 'peso_minimo' => 47, 'peso_maximo' => 77, 'tipo' => 'juvenil'],
            ['nombre' => 'PW', 'peso_minimo' => 40, 'peso_maximo' => 66, 'tipo' => 'juvenil'],

            // Flag Femenil
            ['nombre' => 'Master Flag', 'peso_minimo' => null, 'peso_maximo' => null, 'tipo' => 'flag_femenil'],
            ['nombre' => 'Flag Junior', 'peso_minimo' => null, 'peso_maximo' => null, 'tipo' => 'flag_femenil'],
            ['nombre' => 'Flag Juvenil', 'peso_minimo' => null, 'peso_maximo' => null, 'tipo' => 'flag_femenil'],
            ['nombre' => 'Flag Infantil', 'peso_minimo' => null, 'peso_maximo' => null, 'tipo' => 'flag_femenil'],
            ['nombre' => 'Baby Flag', 'peso_minimo' => null, 'peso_maximo' => null, 'tipo' => 'flag_femenil'],
            ['nombre' => 'Mini Flag (N/C)', 'peso_minimo' => null, 'peso_maximo' => null, 'tipo' => 'flag_femenil'],

            // Flag Infantil Varonil
            ['nombre' => 'As', 'peso_minimo' => null, 'peso_maximo' => null, 'tipo' => 'flag_infantil_varonil'],
            ['nombre' => 'Hs', 'peso_minimo' => null, 'peso_maximo' => null, 'tipo' => 'flag_infantil_varonil'],
            ['nombre' => 'hs', 'peso_minimo' => null, 'peso_maximo' => null, 'tipo' => 'flag_infantil_varonil'],
            ['nombre' => 'Ms (NC)', 'peso_minimo' => null, 'peso_maximo' => null, 'tipo' => 'flag_infantil_varonil'],
        ]);
    }
}
