<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->string('color', 7)->nullable()->default(null)->after('name');
        });

        $defaults = [
            'Cibo' => '#eab308',
            'Affitto' => '#3b82f6',
            'Svago' => '#ec4899',
            'Stipendio' => '#10b981',
            'Altro' => '#64748b',
        ];

        foreach ($defaults as $name => $color) {
            DB::table('categories')->where('name', $name)->update(['color' => $color]);
        }
    }

    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('color');
        });
    }
};
