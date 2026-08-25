<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bigone_reservas', function (Blueprint $table) {
            $table->string('fecha_nacimiento')->nullable()->after('correo');
            $table->text('documentos')->nullable()->after('ref_pago');
        });
    }

    public function down(): void
    {
        Schema::table('bigone_reservas', function (Blueprint $table) {
            $table->dropColumn(['fecha_nacimiento', 'documentos']);
        });
    }
};
