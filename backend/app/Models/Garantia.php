<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Garantia extends Model
{
    protected $fillable = [
        'reserva_id','cliente_nombre','vehiculo',
        'monto','monto_devuelto','fecha_recibido',
        'fecha_devuelto','estado','notas',
    ];

    protected $casts = [
        'monto'          => 'float',
        'monto_devuelto' => 'float',
        'fecha_recibido' => 'date',
        'fecha_devuelto' => 'date',
    ];

    public function reserva() { return $this->belongsTo(Reserva::class); }
}
