<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehiculo_id')->constrained('vehiculos');
            $table->foreignId('cliente_id')->constrained('clientes');
            $table->date('fecha_inicio');
            $table->date('fecha_fin');
            $table->unsignedSmallInteger('dias');
            $table->unsignedInteger('precio_total');
            $table->string('estado')->default('pendiente'); // pendiente, confirmada, activa, completada, cancelada
            $table->string('tipo_uso')->default('urbano'); // urbano, viaje
            $table->text('notas')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservas');
    }
};
