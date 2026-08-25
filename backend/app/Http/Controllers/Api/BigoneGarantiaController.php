<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BigoneGarantia;
use App\Models\BigoneReserva;
use Illuminate\Http\Request;

class BigoneGarantiaController extends Controller
{
    // Público: registrar garantía con comprobante
    public function store(Request $request)
    {
        $ci = $request->input('ci');

        // Buscar datos del cliente en bigone_reservas si no se pasan
        $reserva = BigoneReserva::where('ci', $ci)
            ->whereIn('estado', ['pagada', 'confirmada', 'activa'])
            ->latest()
            ->first();

        $g = BigoneGarantia::create([
            'ci'              => $ci,
            'nombre'          => $request->input('nombre') ?? ($reserva?->nombre ?? ''),
            'vehiculo'        => $request->input('vehiculo') ?? ($reserva ? trim($reserva->vehiculo . ' ' . $reserva->año) : null),
            'telefono'        => $request->input('telefono') ?? ($reserva?->telefono ?? ''),
            'monto'           => $request->input('monto'),
            'comprobante_url' => $request->input('comprobante_url'),
            'estado'          => 'pendiente',
        ]);

        return response()->json($g, 201);
    }

    // Admin: listar todas
    public function index()
    {
        return response()->json(BigoneGarantia::latest()->get());
    }

    // Admin: cambiar estado
    public function update(Request $request, $id)
    {
        $g = BigoneGarantia::findOrFail($id);
        $g->update(['estado' => $request->input('estado')]);
        return response()->json($g);
    }

    // Admin: eliminar
    public function destroy($id)
    {
        BigoneGarantia::findOrFail($id)->delete();
        return response()->json(['ok' => true]);
    }
}
