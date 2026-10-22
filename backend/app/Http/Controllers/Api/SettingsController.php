<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    // GET /api/settings — público, el sitio lo consulta para saber si mostrar reservas
    public function index()
    {
        return response()->json([
            'reservas_activas' => Setting::get('reservas_activas', 'true') === 'true',
        ]);
    }

    // PATCH /api/admin/settings — protegido
    public function update(Request $request)
    {
        $data = $request->validate([
            'reservas_activas' => 'required|boolean',
        ]);

        Setting::set('reservas_activas', $data['reservas_activas'] ? 'true' : 'false');

        return response()->json([
            'reservas_activas' => $data['reservas_activas'],
        ]);
    }
}
