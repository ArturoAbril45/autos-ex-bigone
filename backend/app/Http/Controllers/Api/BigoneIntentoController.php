<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BigoneIntento;
use Illuminate\Http\Request;

class BigoneIntentoController extends Controller
{
    // Público: registrar intento
    public function store(Request $request)
    {
        $i = BigoneIntento::create([
            'ref_id'       => $request->input('ref_id'),
            'nombre'       => $request->input('nombre'),
            'ci'           => $request->input('ci'),
            'telefono'     => $request->input('telefono'),
            'correo'       => $request->input('correo'),
            'vehiculo'     => $request->input('vehiculo'),
            'año'          => $request->input('año'),
            'monto'        => $request->input('monto'),
            'dias'         => $request->input('dias'),
            'fecha_ingreso'=> $request->input('fecha_ingreso'),
            'fecha_entrega'=> $request->input('fecha_entrega'),
            'tipo_cliente' => $request->input('tipo_cliente'),
            'etapa'        => $request->input('etapa', 'pago'),
            'origen'       => $request->input('origen', 'reserva'),
            'lat'          => $request->input('lat'),
            'lng'          => $request->input('lng'),
            'completada'   => false,
        ]);

        return response()->json($i, 201);
    }

    // Público: marcar como completado
    public function completar($refId)
    {
        BigoneIntento::where('ref_id', $refId)->update(['completada' => true]);
        return response()->json(['ok' => true]);
    }

    // Admin: listar no completados
    public function index()
    {
        return response()->json(
            BigoneIntento::where('completada', false)->latest()->get()
        );
    }

    // Admin: eliminar
    public function destroy($id)
    {
        BigoneIntento::findOrFail($id)->delete();
        return response()->json(['ok' => true]);
    }
}
