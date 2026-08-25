<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BigoneIntento extends Model
{
    protected $table = 'bigone_intentos';

    protected $fillable = [
        'ref_id', 'nombre', 'ci', 'telefono', 'correo',
        'vehiculo', 'año', 'monto', 'dias',
        'fecha_ingreso', 'fecha_entrega',
        'tipo_cliente', 'etapa', 'origen',
        'lat', 'lng', 'completada',
    ];
}
