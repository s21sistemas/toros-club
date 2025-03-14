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
        Schema::create('transferencias_jugadores', function (Blueprint $table) {
            $table->id();
            $table->string('club_anterior');
            $table->unsignedInteger('temporadas_jugadas');
            $table->string('motivo_transferencia');
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
        Schema::dropIfExists('transferencias_jugadores');
    }
};
