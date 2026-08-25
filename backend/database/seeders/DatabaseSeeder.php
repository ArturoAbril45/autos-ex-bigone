<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@bigone.com'],
            [
                'name'     => 'Admin Big One',
                'password' => Hash::make('BigOne2026'),
            ]
        );
    }
}
