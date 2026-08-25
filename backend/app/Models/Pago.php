<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pago extends Model
{
    protected $table = 'pagos';

    protected $fillable = ['reserva_id', 'monto', 'tipo', 'fecha', 'notas'];

    public function reserva()
    {
        return $this->belongsTo(Reserva::class);
    }
}
