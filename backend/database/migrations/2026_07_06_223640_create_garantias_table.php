<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('garantias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reserva_id')->nullable()->constrained()->nullOnDelete();
            $table->string('cliente_nombre');
            $table->string('vehiculo');
            $table->decimal('monto', 10, 2);
            $table->decimal('monto_devuelto', 10, 2)->default(0);
            $table->date('fecha_recibido');
            $table->date('fecha_devuelto')->nullable();
            $table->enum('estado', ['retenida', 'devuelta', 'parcial'])->default('retenida');
            $table->text('notas')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('garantias');
    }
};
