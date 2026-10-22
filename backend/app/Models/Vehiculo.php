<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehiculo extends Model
{
    protected $table = 'vehiculos';

    protected $fillable = [
        'modelo', 'marca', 'año', 'categoria', 'transmision',
        'precio_diario', 'precio_semanal', 'precio_mensual',
        'km_libres', 'seguro_incluido', 'colores', 'features',
        'imagen', 'disponible',
    ];

    protected $casts = [
        'colores'         => 'array',
        'features'        => 'array',
        'seguro_incluido' => 'boolean',
        'disponible'      => 'boolean',
    ];

    public function reservas()
    {
        return $this->hasMany(Reserva::class, 'vehiculo_id');
    }
}
