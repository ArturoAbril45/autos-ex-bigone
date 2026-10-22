<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = ['clave', 'valor'];

    public static function get(string $clave, $default = null)
    {
        return static::where('clave', $clave)->value('valor') ?? $default;
    }

    public static function set(string $clave, $valor): void
    {
        static::updateOrCreate(['clave' => $clave], ['valor' => $valor]);
    }
}
