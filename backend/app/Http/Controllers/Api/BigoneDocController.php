<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BigoneDocController extends Controller
{
    public function store(Request $request)
    {
        $file = $request->file('doc');
        if (!$file) {
            return response()->json(['error' => 'No se recibió archivo'], 400);
        }

        $uploadDir = '/home/bigone/public_html/uploads/bigone-docs/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $ext  = $file->getClientOriginalExtension() ?: 'jpg';
        $name = uniqid('doc_') . '.' . $ext;
        $file->move($uploadDir, $name);

        return response()->json([
            'url' => 'https://bigonerentacar.online/uploads/bigone-docs/' . $name,
        ]);
    }
}
