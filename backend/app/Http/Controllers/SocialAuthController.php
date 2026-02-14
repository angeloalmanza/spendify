<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\User;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function handleGoogleCallback()
    {
        $googleUser = Socialite::driver('google')->stateless()->user();

        $user = User::where('email', $googleUser->getEmail())->first();

        if ($user) {
            // Utente esistente: aggiorna solo google_id, non toccare avatar né password
            $user->google_id = $googleUser->getId();
            $user->save();
        } else {
            // Nuovo utente: crea con avatar di Google come default
            $user = User::create([
                'name'      => $googleUser->getName(),
                'email'     => $googleUser->getEmail(),
                'google_id' => $googleUser->getId(),
                'avatar'    => $googleUser->getAvatar(),
                'password'  => null,
            ]);

            Category::createDefaults($user);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');

        return redirect("{$frontendUrl}/auth/callback?token={$token}");
    }
}
