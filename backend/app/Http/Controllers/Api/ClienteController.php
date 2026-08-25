<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    public function index()
    {
        return response()->json(Cliente::withCount('reservas')->latest()->get());
    }

    public function show(string $id)
    {
        return response()->json(Cliente::with('reservas.vehiculo')->findOrFail($id));
    }

    public function destroy(string $id)
    {
        $cliente = Cliente::findOrFail($id);

        if ($cliente->reservas()->exists()) {
            return response()->json([
                'message' => 'No se puede eliminar el cliente porque tiene reservas asociadas.',
            ], 409);
        }

        $cliente->delete();
        return response()->json(['message' => 'eliminado']);
    }
}
