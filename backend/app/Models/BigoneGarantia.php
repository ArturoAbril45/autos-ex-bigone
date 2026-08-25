<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BigoneGarantia extends Model
{
    protected $table = 'bigone_garantias';

    protected $fillable = [
        'ci', 'nombre', 'vehiculo', 'telefono',
        'monto', 'comprobante_url', 'estado',
    ];
}
