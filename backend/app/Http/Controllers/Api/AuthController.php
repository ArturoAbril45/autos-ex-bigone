<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $creds = $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($creds)) {
            return response()->json(['message' => 'Credenciales incorrectas'], 401);
        }

        $user = Auth::user();

        if (!$user->activo) {
            Auth::logout();
            return response()->json(['message' => 'Este usuario está desactivado.'], 403);
        }

        $token = $user->createToken('admin')->plainTextToken;

        return response()->json([
            'token' => $token,
            'name'  => $user->name,
            'rol'   => $user->rol,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'ok']);
    }
}
