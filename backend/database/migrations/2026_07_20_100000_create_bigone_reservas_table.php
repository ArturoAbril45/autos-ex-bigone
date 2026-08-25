<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bigone_reservas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->nullable();
            $table->string('ci')->nullable();
            $table->string('telefono')->nullable();
            $table->string('correo')->nullable();
            $table->string('vehiculo')->nullable();
            $table->string('marca')->nullable();
            $table->string('año')->nullable();
            $table->decimal('monto', 10, 2)->nullable();
            $table->integer('dias')->nullable();
            $table->string('fecha_ingreso')->nullable();
            $table->string('fecha_entrega')->nullable();
            $table->string('tipo_cliente')->nullable();
            $table->string('estado')->default('pagada'); // pagada | anulada
            $table->string('origen')->nullable();
            $table->decimal('lat', 10, 6)->nullable();
            $table->decimal('lng', 10, 6)->nullable();
            $table->string('ref_pago')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bigone_reservas');
    }
};
