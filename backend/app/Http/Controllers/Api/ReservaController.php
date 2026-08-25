<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Reserva;
use App\Models\Vehiculo;
use Illuminate\Http\Request;

class ReservaController extends Controller
{
    public function index()
    {
        $reservas = Reserva::with(['vehiculo', 'cliente'])->latest()->get();
        return response()->json($reservas);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'vehiculo_id'     => 'required|exists:vehiculos,id',
            'fecha_inicio'    => 'required|date',
            'fecha_fin'       => 'required|date|after:fecha_inicio',
            'tipo_uso'        => 'in:urbano,viaje',
            'cliente.nombre'  => 'required|string',
            'cliente.apellido'=> 'required|string',
            'cliente.ci'      => 'required|string',
            'cliente.telefono'=> 'required|string',
            'cliente.email'   => 'nullable|email',
            'cliente.direccion'=> 'nullable|string',
        ]);

        $clienteData = $request->input('cliente');
        $cliente = Cliente::firstOrCreate(
            ['ci' => $clienteData['ci']],
            $clienteData
        );
        $cliente->update($clienteData);

        $vehiculo = Vehiculo::findOrFail($data['vehiculo_id']);
        $dias = (int) round((strtotime($data['fecha_fin']) - strtotime($data['fecha_inicio'])) / 86400);
        $total = $dias * $vehiculo->precio_diario;

        $reserva = Reserva::create([
            'vehiculo_id'  => $vehiculo->id,
            'cliente_id'   => $cliente->id,
            'fecha_inicio' => $data['fecha_inicio'],
            'fecha_fin'    => $data['fecha_fin'],
            'dias'         => $dias,
            'precio_total' => $total,
            'tipo_uso'     => $request->input('tipo_uso', 'urbano'),
            'estado'       => 'pendiente',
        ]);

        return response()->json($reserva->load(['vehiculo', 'cliente']), 201);
    }

    public function show(string $id)
    {
        return response()->json(Reserva::with(['vehiculo', 'cliente'])->findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $reserva = Reserva::findOrFail($id);
        $reserva->update($request->only(['estado', 'notas']));
        return response()->json($reserva->load(['vehiculo', 'cliente']));
    }

    public function destroy(string $id)
    {
        Reserva::findOrFail($id)->delete();
        return response()->json(['message' => 'eliminado']);
    }
}
