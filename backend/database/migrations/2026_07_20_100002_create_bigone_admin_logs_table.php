<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bigone_admin_logs', function (Blueprint $table) {
            $table->id();
            $table->string('accion');         // crear | anular | restaurar | eliminar | exportar
            $table->string('descripcion')->nullable();
            $table->string('ref_id')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bigone_admin_logs');
    }
};
