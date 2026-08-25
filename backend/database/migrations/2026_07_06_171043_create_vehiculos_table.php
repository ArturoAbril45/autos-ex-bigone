<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehiculos', function (Blueprint $table) {
            $table->id();
            $table->string('modelo');
            $table->unsignedSmallInteger('año');
            $table->string('categoria'); // economico, sedan, suv, premium, 4x4, lujo
            $table->string('transmision')->default('automatica');
            $table->unsignedInteger('precio_diario');
            $table->unsignedInteger('precio_semanal')->nullable();
            $table->unsignedInteger('precio_mensual')->nullable();
            $table->unsignedSmallInteger('km_libres')->default(150);
            $table->boolean('seguro_incluido')->default(true);
            $table->json('colores')->nullable();
            $table->json('features')->nullable();
            $table->string('imagen')->nullable();
            $table->boolean('disponible')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehiculos');
    }
};
