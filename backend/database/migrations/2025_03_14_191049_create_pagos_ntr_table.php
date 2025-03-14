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
        Schema::create('pagos_ntr', function (Blueprint $table) {
            $table->id();
            $table->boolean('inscripcion')->default(false);
            $table->boolean('tunel')->default(false);
            $table->boolean('botiquin')->default(false);
            $table->boolean('coacheo_semanal')->default(false);
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
        Schema::dropIfExists('pagos_ntr');
    }
};
