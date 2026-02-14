<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['user_id', 'name', 'color'];

    public const DEFAULTS = [
        'Cibo' => '#eab308',
        'Affitto' => '#3b82f6',
        'Svago' => '#ec4899',
        'Stipendio' => '#10b981',
        'Altro' => '#64748b',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function createDefaults(User $user): void
    {
        foreach (self::DEFAULTS as $name => $color) {
            $user->categories()->firstOrCreate(
                ['name' => $name],
                ['color' => $color],
            );
        }
    }
}
