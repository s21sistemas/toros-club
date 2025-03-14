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
        Schema::create('documentos', function (Blueprint $table) {
            $table->id();
            $table->string('curp_jugador')->nullable();
            $table->string('ine_tutor')->nullable();
            $table->string('acta_nacimiento')->nullable();
            $table->string('comprobante_domicilio')->nullable();
            $table->string('firma')->nullable();
            $table->foreignId('registro_jugador_id')->unique()->constrained('registro_jugadores')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('documentos');
    }
};
