<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BigoneAdminLog;

class BigoneAdminLogController extends Controller
{
    public function index()
    {
        return response()->json(BigoneAdminLog::latest()->limit(500)->get());
    }
}
