<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BigoneAdminLog extends Model
{
    protected $table = 'bigone_admin_logs';

    protected $fillable = ['accion', 'descripcion', 'ref_id'];
}
