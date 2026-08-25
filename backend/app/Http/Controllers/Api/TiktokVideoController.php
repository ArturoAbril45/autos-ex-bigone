<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TiktokVideo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TiktokVideoController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            TiktokVideo::orderBy('orden')->orderByDesc('created_at')->get(['id', 'tiktok_id', 'url'])
        );
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'tiktok_id' => 'required|string|max:50|unique:tiktok_videos,tiktok_id',
            'url'       => 'required|url|max:500',
        ]);

        $data['orden'] = TiktokVideo::count();
        $video = TiktokVideo::create($data);

        return response()->json($video, 201);
    }

    public function destroy(TiktokVideo $tiktokVideo): JsonResponse
    {
        $tiktokVideo->delete();
        return response()->json(['ok' => true]);
    }
}
