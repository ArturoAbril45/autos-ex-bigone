<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UsuariosController extends Controller
{
    private function autorizarAdmin(Request $request)
    {
        if ($request->user()->rol !== 'admin') {
            abort(response()->json(['message' => 'No autorizado. Solo un administrador puede gestionar usuarios.'], 403));
        }
    }

    public function index(Request $request)
    {
        $this->autorizarAdmin($request);

        return response()->json(User::select('id', 'name', 'email', 'rol', 'activo', 'created_at')->latest()->get());
    }

    public function store(Request $request)
    {
        $this->autorizarAdmin($request);

        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'rol'      => ['required', Rule::in(['admin', 'asesor'])],
            'activo'   => 'boolean',
        ]);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'rol'      => $data['rol'],
            'activo'   => $data['activo'] ?? true,
        ]);

        return response()->json($user->only('id', 'name', 'email', 'rol', 'activo', 'created_at'), 201);
    }

    public function update(Request $request, string $id)
    {
        $this->autorizarAdmin($request);

        $user = User::findOrFail($id);

        $data = $request->validate([
            'name'     => 'sometimes|required|string|max:255',
            'email'    => ['sometimes', 'required', 'email', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => 'nullable|string|min:6',
            'rol'      => ['sometimes', 'required', Rule::in(['admin', 'asesor'])],
            'activo'   => 'boolean',
        ]);

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        if (($data['rol'] ?? $user->rol) !== 'admin' && $user->rol === 'admin' && User::where('rol', 'admin')->count() <= 1) {
            return response()->json(['message' => 'Debe existir al menos un usuario administrador.'], 409);
        }

        $user->update($data);

        return response()->json($user->only('id', 'name', 'email', 'rol', 'activo', 'created_at'));
    }

    public function destroy(Request $request, string $id)
    {
        $this->autorizarAdmin($request);

        $user = User::findOrFail($id);

        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'No puedes eliminar tu propia cuenta.'], 409);
        }

        if ($user->rol === 'admin' && User::where('rol', 'admin')->count() <= 1) {
            return response()->json(['message' => 'Debe existir al menos un usuario administrador.'], 409);
        }

        $user->delete();
        return response()->json(['message' => 'eliminado']);
    }
}
