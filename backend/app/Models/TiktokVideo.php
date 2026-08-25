<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TiktokVideo extends Model
{
    protected $fillable = ['tiktok_id', 'url', 'orden'];
}
