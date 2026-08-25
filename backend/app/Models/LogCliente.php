<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogCliente extends Model
{
    protected $table = 'logs_clientes';

    protected $fillable = [
        'nombre', 'ci', 'celular', 'correo',
        'vehiculo', 'año', 'monto', 'dias',
        'fecha_ingreso', 'fecha_entrega',
        'tipo_cliente', 'estado', 'origen',
        'lat', 'lng',
    ];
}
