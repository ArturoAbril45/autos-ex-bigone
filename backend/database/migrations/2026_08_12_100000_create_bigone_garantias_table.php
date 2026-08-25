<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bigone_garantias', function (Blueprint $table) {
            $table->id();
            $table->string('ci');
            $table->string('nombre');
            $table->string('vehiculo')->nullable();
            $table->string('telefono')->nullable();
            $table->decimal('monto', 10, 2)->nullable();
            $table->string('comprobante_url')->nullable();
            $table->enum('estado', ['pendiente', 'verificada', 'devuelta'])->default('pendiente');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bigone_garantias');
    }
};
