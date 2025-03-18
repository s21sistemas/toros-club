<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('registro_jugadores', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 20);
            $table->string('apellido_p', 30);
            $table->string('apellido_m', 30);
            $table->enum('sexo', ['hombre', 'mujer']);
            $table->mediumText('direccion');
            $table->string('telefono', 15);
            $table->date('fecha_nacimiento');
            $table->string('lugar_nacimiento');
            $table->string('curp', 18)->unique();
            $table->enum('grado_escolar', ['primaria', 'secundaria', 'preparatoria']);
            $table->string('nombre_escuela');
            $table->mediumText('alergias');
            $table->mediumText('padecimientos');
            $table->decimal('peso', 5, 2);
            $table->enum('tipo_inscripcion', ['novato', 'reinscripcion', 'transferencia', 'porrista']);
            $table->longText('foto_jugador')->nullable();
            $table->string('numero_mfl', 8)->nullable();
            $table->foreignId('usuario_id')->constrained('usuarios')->onDelete('cascade');
            $table->foreignId('categoria_id')->constrained('categorias')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('registro_jugadores');
    }
};
