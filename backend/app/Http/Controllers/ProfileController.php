<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name'             => ['required', 'string', 'max:255'],
            'email'            => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'avatar'           => ['nullable', 'string', 'max:500'],
            'current_password' => ['nullable', 'string'],
            'new_password'     => ['nullable', 'confirmed', Password::min(8)],
        ]);

        if (!empty($validated['new_password'])) {
            if (empty($validated['current_password']) || !Hash::check($validated['current_password'], $user->password)) {
                return response()->json(['errors' => ['current_password' => ['Password attuale non corretta']]], 422);
            }
            $user->password = $validated['new_password'];
        }

        $user->name   = $validated['name'];
        $user->email  = $validated['email'];
        $user->avatar = $validated['avatar'] ?? $user->avatar;
        $user->save();

        return response()->json($user);
    }
}
