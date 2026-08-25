<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BigoneReserva;
use App\Models\Garantia;
use App\Models\Reserva;
use Illuminate\Http\Request;

class FinanzasController extends Controller
{
    public function resumen()
    {
        $estadosBigone = ['pagada','confirmada','activa','completada'];

        $ingresos = Reserva::whereIn('estado', ['completada','activa'])->sum('precio_total')
            + BigoneReserva::whereIn('estado', $estadosBigone)->sum('monto');

        $ingresosHoy = Reserva::whereIn('estado', ['completada','activa'])->whereDate('created_at', today())->sum('precio_total')
            + BigoneReserva::whereIn('estado', $estadosBigone)->whereDate('created_at', today())->sum('monto');

        $ingresosMes = Reserva::whereIn('estado', ['completada','activa'])->whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->sum('precio_total')
            + BigoneReserva::whereIn('estado', $estadosBigone)->whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->sum('monto');

        $garantiasTotal    = Garantia::sum('monto');
        $garantiasDevueltas = Garantia::sum('monto_devuelto');
        $garantiasSaldo    = $garantiasTotal - $garantiasDevueltas;

        $ingresosPorMes = [];
        for ($i = 5; $i >= 0; $i--) {
            $d = now()->subMonths($i);
            $ingresosPorMes[] = [
                'mes'   => $d->locale('es')->isoFormat('MMM'),
                'total' => (float) (
                    Reserva::whereIn('estado', ['completada','activa'])->whereMonth('created_at', $d->month)->whereYear('created_at', $d->year)->sum('precio_total')
                    + BigoneReserva::whereIn('estado', $estadosBigone)->whereMonth('created_at', $d->month)->whereYear('created_at', $d->year)->sum('monto')
                ),
            ];
        }

        return response()->json([
            'ingresos_total'      => (float) $ingresos,
            'ingresos_hoy'        => (float) $ingresosHoy,
            'ingresos_mes'        => (float) $ingresosMes,
            'garantias_total'     => (float) $garantiasTotal,
            'garantias_devueltas' => (float) $garantiasDevueltas,
            'garantias_saldo'     => (float) $garantiasSaldo,
            'ingresos_por_mes'    => $ingresosPorMes,
        ]);
    }

    // --- Ingresos (reservas cobradas) ---
    public function ingresos()
    {
        $reservas = Reserva::with(['cliente','vehiculo'])
            ->whereIn('estado', ['completada','activa'])
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($r) => [
                'id'           => $r->id,
                'cliente'      => $r->cliente?->nombre . ' ' . $r->cliente?->apellido,
                'vehiculo'     => $r->vehiculo?->modelo,
                'fecha_inicio' => $r->fecha_inicio,
                'fecha_fin'    => $r->fecha_fin,
                'dias'         => $r->dias,
                'total'        => (float) $r->precio_total,
                'estado'       => $r->estado,
                'tipo'         => $r->tipo_uso,
            ]);

        return response()->json($reservas);
    }

    // --- Garantías ---
    public function garantias()
    {
        return response()->json(Garantia::orderByDesc('fecha_recibido')->get());
    }

    public function storeGarantia(Request $request)
    {
        $data = $request->validate([
            'cliente_nombre' => 'required|string',
            'vehiculo'       => 'required|string',
            'monto'          => 'required|numeric|min:0',
            'fecha_recibido' => 'required|date',
            'reserva_id'     => 'nullable|exists:reservas,id',
            'notas'          => 'nullable|string',
        ]);
        $data['estado'] = 'retenida';
        return response()->json(Garantia::create($data), 201);
    }

    public function devolverGarantia(Request $request, $id)
    {
        $garantia = Garantia::findOrFail($id);
        $data = $request->validate([
            'monto_devuelto' => 'required|numeric|min:0',
            'fecha_devuelto' => 'required|date',
            'notas'          => 'nullable|string',
        ]);
        $garantia->monto_devuelto = $data['monto_devuelto'];
        $garantia->fecha_devuelto = $data['fecha_devuelto'];
        $garantia->notas          = $data['notas'] ?? $garantia->notas;
        $garantia->estado = $data['monto_devuelto'] >= $garantia->monto ? 'devuelta' : 'parcial';
        $garantia->save();
        return response()->json($garantia);
    }

    public function destroyGarantia($id)
    {
        Garantia::findOrFail($id)->delete();
        return response()->json(['ok' => true]);
    }
}
