<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LogCliente;
use Illuminate\Http\Request;

class LogClienteController extends Controller
{
    public function store(Request $request)
    {
        LogCliente::create([
            'nombre'        => $request->input('nombre'),
            'ci'            => $request->input('ci'),
            'celular'       => $request->input('celular'),
            'correo'        => $request->input('correo'),
            'vehiculo'      => $request->input('vehiculo'),
            'año'           => $request->input('año'),
            'monto'         => $request->input('monto'),
            'dias'          => $request->input('dias'),
            'fecha_ingreso' => $request->input('fecha_ingreso'),
            'fecha_entrega' => $request->input('fecha_entrega'),
            'tipo_cliente'  => $request->input('tipo_cliente'),
            'estado'        => $request->input('estado'),
            'origen'        => $request->input('origen'),
            'lat'           => $request->input('lat'),
            'lng'           => $request->input('lng'),
        ]);

        return response()->json(['ok' => true], 201);
    }
}
