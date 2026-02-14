<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name', 100);
            $table->timestamps();

            $table->unique(['user_id', 'name']);
        });

        $names = ['Cibo', 'Affitto', 'Svago', 'Stipendio', 'Altro'];
        $now = now();

        User::each(function (User $user) use ($names, $now) {
            foreach ($names as $name) {
                DB::table('categories')->insert([
                    'user_id' => $user->id,
                    'name' => $name,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
