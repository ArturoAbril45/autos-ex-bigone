<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehiculo;
use App\Models\BigoneReserva;
use Illuminate\Http\Request;

class VehiculoController extends Controller
{
    private function reglas(): array
    {
        return [
            'modelo'         => 'required|string',
            'marca'          => 'nullable|string',
            'año'            => 'required|integer',
            'categoria'      => 'required|string',
            'transmision'    => 'required|string',
            'precio_diario'  => 'required|integer',
            'precio_semanal' => 'nullable|integer',
            'precio_mensual' => 'nullable|integer',
            'km_libres'      => 'nullable|integer',
            'seguro_incluido'=> 'boolean',
            'colores'        => 'nullable|array',
            'features'       => 'nullable|array',
            'disponible'     => 'boolean',
            'imagen'         => 'nullable|string',
        ];
    }

    public function index()
    {
        return response()->json(Vehiculo::all());
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->reglas());
        return response()->json(Vehiculo::create($data), 201);
    }

    public function show(string $id)
    {
        return response()->json(Vehiculo::findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $v = Vehiculo::findOrFail($id);
        $data = $request->validate($this->reglas());
        $v->update($data);
        return response()->json($v);
    }

    // POST /api/admin/vehiculos/upload-imagen — recibe un archivo real y lo guarda en storage/app/public/vehiculos
    public function uploadImagen(Request $request)
    {
        $request->validate([
            'imagen' => 'required|image|max:4096', // 4MB
        ]);

        $path = $request->file('imagen')->store('vehiculos', 'public');

        // Construimos la URL desde la petición real (host:puerto) en vez de
        // depender de APP_URL, que en local no siempre incluye el puerto.
        $url = $request->getSchemeAndHttpHost() . '/storage/' . $path;

        return response()->json(['url' => $url], 201);
    }

    public function destroy(string $id)
    {
        $vehiculo = Vehiculo::findOrFail($id);

        if ($vehiculo->reservas()->exists()) {
            return response()->json([
                'message' => 'No se puede eliminar el vehículo porque tiene reservas asociadas.',
            ], 409);
        }

        $vehiculo->delete();
        return response()->json(['message' => 'eliminado']);
    }

    // GET /api/vehiculos/{id}/disponibilidad?fecha_inicio=YYYY-MM-DD&fecha_fin=YYYY-MM-DD&vehiculo=Modelo
    public function disponibilidad(Request $request, string $id)
    {
        $inicio  = $request->query('fecha_inicio');
        $fin     = $request->query('fecha_fin');
        $nombre  = $request->query('vehiculo'); // nombre del modelo para cubrir reservas sin vehiculo_id

        if (!$inicio || !$fin) {
            return response()->json(['disponible' => true]);
        }

        $estadosActivos = ['pagada', 'confirmada', 'activa'];

        $conflicto = BigoneReserva::whereIn('estado', $estadosActivos)
            ->where('fecha_ingreso', '<=', $fin)
            ->where('fecha_entrega', '>=', $inicio)
            ->where(function ($q) use ($id, $nombre) {
                $q->where('vehiculo_id', $id);
                if ($nombre) {
                    // cubre reservas antiguas que no tienen vehiculo_id guardado
                    $q->orWhere('vehiculo', 'LIKE', '%' . $nombre . '%');
                }
            })
            ->exists();

        return response()->json(['disponible' => !$conflicto]);
    }
}
