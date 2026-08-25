<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BigoneReserva;
use App\Models\BigoneAdminLog;
use App\Models\Cliente;
use Illuminate\Http\Request;

class BigoneReservaController extends Controller
{
    // Público: guardar reserva confirmada desde frontend
    public function store(Request $request)
    {
        $nombreCompleto = trim($request->input('nombre', ''));
        $partes         = explode(' ', $nombreCompleto, 2);
        $nombre         = $partes[0] ?? $nombreCompleto;
        $apellido       = $partes[1] ?? '';
        $ci             = $request->input('ci');

        // Crear o actualizar cliente en la tabla de clientes
        if ($ci) {
            Cliente::updateOrCreate(
                ['ci' => $ci],
                [
                    'nombre'   => $nombre,
                    'apellido' => $apellido,
                    'telefono' => $request->input('telefono', ''),
                    'email'    => $request->input('correo'),
                ]
            );
        }

        $docsRaw = $request->input('documentos');
        $docsJson = is_array($docsRaw) ? json_encode($docsRaw) : $docsRaw;

        $r = BigoneReserva::create([
            'vehiculo_id'     => $request->input('vehiculo_id'),
            'nombre'          => $nombreCompleto,
            'ci'              => $ci,
            'telefono'        => $request->input('telefono'),
            'correo'          => $request->input('correo'),
            'fecha_nacimiento'=> $request->input('fecha_nacimiento'),
            'vehiculo'        => $request->input('vehiculo'),
            'marca'           => $request->input('marca'),
            'año'             => $request->input('año'),
            'monto'           => $request->input('monto'),
            'dias'            => $request->input('dias'),
            'fecha_ingreso'   => $request->input('fecha_ingreso'),
            'fecha_entrega'   => $request->input('fecha_entrega'),
            'tipo_cliente'    => $request->input('tipo_cliente'),
            'estado'          => 'pagada',
            'origen'          => $request->input('origen', 'reserva'),
            'lat'             => $request->input('lat'),
            'lng'             => $request->input('lng'),
            'ref_pago'        => $request->input('ref_pago'),
            'documentos'      => $docsJson,
        ]);

        return response()->json($r, 201);
    }

    // Público: buscar cliente por CI (para modal de garantía)
    public function buscarPorCi(Request $request)
    {
        $ci = $request->query('ci');
        if (!$ci) return response()->json(['error' => 'CI requerido'], 400);

        $reserva = BigoneReserva::where('ci', $ci)
            ->whereIn('estado', ['pagada', 'confirmada', 'activa'])
            ->latest()
            ->first();

        if (!$reserva) {
            return response()->json(['error' => 'No se encontró una reserva activa con ese CI'], 404);
        }

        return response()->json([
            'nombre'   => $reserva->nombre,
            'ci'       => $reserva->ci,
            'vehiculo' => trim($reserva->vehiculo . ' ' . $reserva->año),
            'telefono' => $reserva->telefono,
        ]);
    }

    // Admin: listar todas (incluye papelera si ?con_papelera=1)
    public function index(Request $request)
    {
        $query = $request->boolean('con_papelera')
            ? BigoneReserva::withTrashed()
            : BigoneReserva::query();

        return response()->json($query->latest()->get());
    }

    // Admin: cambiar estado (pagada / anulada)
    public function update(Request $request, $id)
    {
        $r = BigoneReserva::withTrashed()->findOrFail($id);
        $nuevoEstado = $request->input('estado');
        $r->update(['estado' => $nuevoEstado]);

        BigoneAdminLog::create([
            'accion'      => $nuevoEstado === 'anulada' ? 'anular' : 'restaurar_estado',
            'descripcion' => "Reserva #{$id} ({$r->nombre}) cambiada a {$nuevoEstado}",
            'ref_id'      => $id,
        ]);

        return response()->json($r);
    }

    // Admin: mover a papelera (soft delete)
    public function destroy($id)
    {
        $r = BigoneReserva::findOrFail($id);
        BigoneAdminLog::create([
            'accion'      => 'papelera',
            'descripcion' => "Reserva #{$id} ({$r->nombre}) movida a papelera",
            'ref_id'      => $id,
        ]);
        $r->delete();

        return response()->json(['ok' => true]);
    }

    // Admin: restaurar desde papelera
    public function restore($id)
    {
        $r = BigoneReserva::withTrashed()->findOrFail($id);
        $r->restore();

        BigoneAdminLog::create([
            'accion'      => 'restaurar',
            'descripcion' => "Reserva #{$id} ({$r->nombre}) restaurada desde papelera",
            'ref_id'      => $id,
        ]);

        return response()->json($r);
    }

    // Admin: eliminar permanentemente
    public function forceDelete($id)
    {
        $r = BigoneReserva::withTrashed()->findOrFail($id);
        BigoneAdminLog::create([
            'accion'      => 'eliminar_permanente',
            'descripcion' => "Reserva #{$id} ({$r->nombre}) eliminada permanentemente",
            'ref_id'      => $id,
        ]);
        $r->forceDelete();

        return response()->json(['ok' => true]);
    }

    // Admin: exportar CSV
    public function export()
    {
        $reservas = BigoneReserva::withoutTrashed()->latest()->get();

        $csv = "ID,Nombre,CI,Telefono,Correo,Vehiculo,Año,Monto,Dias,Fecha Ingreso,Fecha Entrega,Tipo Cliente,Estado,Origen,Lat,Lng,Fecha Registro\n";
        foreach ($reservas as $r) {
            $csv .= implode(',', [
                $r->id,
                '"' . str_replace('"', '""', $r->nombre ?? '') . '"',
                $r->ci ?? '',
                $r->telefono ?? '',
                $r->correo ?? '',
                '"' . str_replace('"', '""', $r->vehiculo ?? '') . '"',
                $r->año ?? '',
                $r->monto ?? '',
                $r->dias ?? '',
                $r->fecha_ingreso ?? '',
                $r->fecha_entrega ?? '',
                $r->tipo_cliente ?? '',
                $r->estado ?? '',
                $r->origen ?? '',
                $r->lat ?? '',
                $r->lng ?? '',
                $r->created_at ?? '',
            ]) . "\n";
        }

        BigoneAdminLog::create([
            'accion'      => 'exportar',
            'descripcion' => 'Exportación CSV de reservas (' . $reservas->count() . ' registros)',
        ]);

        return response($csv, 200, [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => 'attachment; filename="reservas_bigone_' . date('Y-m-d') . '.csv"',
        ]);
    }
}
