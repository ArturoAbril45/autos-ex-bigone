<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BigoneReserva;
use App\Models\Cliente;
use App\Models\Reserva;
use App\Models\Vehiculo;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $now = now();

        // --- KPIs básicos ---
        $ingresos_mes = Reserva::whereIn('estado', ['confirmada','activa','completada'])
            ->whereYear('created_at', $now->year)
            ->whereMonth('created_at', $now->month)
            ->sum('precio_total')
            + BigoneReserva::whereIn('estado', ['confirmada','activa','completada','pagada'])
            ->whereYear('created_at', $now->year)
            ->whereMonth('created_at', $now->month)
            ->sum('monto');

        $reservas_activas = Reserva::where('estado', 'activa')->count()
            + BigoneReserva::whereIn('estado', ['confirmada','activa','pagada'])->count();
        $vehiculos_total  = Vehiculo::count();
        $total_clientes   = Cliente::count()
            + BigoneReserva::distinct('ci')->whereNotNull('ci')->count('ci');

        $vehiculos_libres = Vehiculo::where('disponible', true)
            ->whereNotIn('id', function ($q) {
                $q->select('vehiculo_id')->from('reservas')
                  ->whereIn('estado', ['confirmada','activa'])
                  ->whereDate('fecha_inicio', '<=', now())
                  ->whereDate('fecha_fin',    '>=', now());
            })->count();

        // --- Ingresos por mes (6 meses) ---
        $ingresos_por_mes = Reserva::whereIn('estado', ['confirmada','activa','completada'])
            ->where('created_at', '>=', now()->subMonths(5)->startOfMonth())
            ->select(
                DB::raw("strftime('%m', created_at) as mes_num"),
                DB::raw('SUM(precio_total) as total')
            )
            ->groupBy('mes_num')
            ->orderBy('mes_num')
            ->get()
            ->map(fn($r) => [
                'mes'   => Carbon::createFromFormat('m', $r->mes_num)->locale('es')->monthName,
                'total' => (int) $r->total,
            ]);

        // --- Top vehículos por número de reservas ---
        $top_vehiculos = DB::table('reservas')
            ->join('vehiculos', 'reservas.vehiculo_id', '=', 'vehiculos.id')
            ->whereIn('reservas.estado', ['confirmada','activa','completada'])
            ->select(
                'vehiculos.id',
                'vehiculos.modelo',
                DB::raw('COUNT(reservas.id) as total_reservas'),
                DB::raw('SUM(reservas.precio_total) as total_ingresos'),
                DB::raw('SUM(reservas.dias) as total_dias')
            )
            ->groupBy('vehiculos.id', 'vehiculos.modelo')
            ->orderByDesc('total_reservas')
            ->limit(5)
            ->get()
            ->map(fn($r) => [
                'id'             => $r->id,
                'modelo'         => $r->modelo,
                'total_reservas' => (int) $r->total_reservas,
                'total_ingresos' => (int) $r->total_ingresos,
                'total_dias'     => (int) $r->total_dias,
            ]);

        // --- Reservas por día de la semana (0=Dom ... 6=Sáb) ---
        $dias_semana_labels = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
        $por_dia_raw = DB::table('reservas')
            ->whereIn('estado', ['confirmada','activa','completada'])
            ->select(
                DB::raw("CAST(strftime('%w', fecha_inicio) AS INTEGER) as dia_num"),
                DB::raw('COUNT(*) as total')
            )
            ->groupBy('dia_num')
            ->orderBy('dia_num')
            ->get()
            ->keyBy('dia_num');

        $reservas_por_dia = collect(range(0, 6))->map(fn($d) => [
            'dia'   => $dias_semana_labels[$d],
            'total' => (int) ($por_dia_raw[$d]->total ?? 0),
        ])->values();

        // --- Reservas por mes del año (pico estacional) ---
        $meses_labels = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
        $por_mes_raw = DB::table('reservas')
            ->whereIn('estado', ['confirmada','activa','completada'])
            ->select(
                DB::raw("CAST(strftime('%m', fecha_inicio) AS INTEGER) - 1 as mes_idx"),
                DB::raw('COUNT(*) as total')
            )
            ->groupBy('mes_idx')
            ->orderBy('mes_idx')
            ->get()
            ->keyBy('mes_idx');

        $reservas_por_mes = collect(range(0, 11))->map(fn($m) => [
            'mes'   => $meses_labels[$m],
            'total' => (int) ($por_mes_raw[$m]->total ?? 0),
        ])->values();

        return response()->json(compact(
            'ingresos_mes', 'reservas_activas', 'vehiculos_total',
            'vehiculos_libres', 'total_clientes', 'ingresos_por_mes',
            'top_vehiculos', 'reservas_por_dia', 'reservas_por_mes'
        ));
    }
}
