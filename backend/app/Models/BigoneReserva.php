<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BigoneReserva extends Model
{
    use SoftDeletes;

    protected $table = 'bigone_reservas';

    protected $fillable = [
        'vehiculo_id',
        'nombre', 'ci', 'telefono', 'correo', 'fecha_nacimiento',
        'vehiculo', 'marca', 'año', 'monto', 'dias',
        'fecha_ingreso', 'fecha_entrega',
        'tipo_cliente', 'estado', 'origen',
        'lat', 'lng', 'ref_pago', 'documentos',
    ];
}
