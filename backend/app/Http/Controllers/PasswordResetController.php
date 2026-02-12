<?php

namespace App\Http\Controllers;

use App\Mail\PasswordResetMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rules\Password as PasswordRule;

class PasswordResetController extends Controller
{
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => ['required', 'email']]);

        $user = User::where('email', $request->email)->first();

        if ($user) {
            try {
                $token = Password::createToken($user);
                $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
                $resetUrl = "{$frontendUrl}/reset-password?token={$token}&email=" . urlencode($user->email);

                Mail::to($user->email)->send(new PasswordResetMail($user, $resetUrl));
            } catch (\Throwable $e) {
                return response()->json(['debug_error' => $e->getMessage()], 500);
            }
        }

        // Risposta generica per evitare l'enumerazione delle email
        return response()->json([
            'message' => 'Se l\'email è registrata, riceverai le istruzioni per reimpostare la password.',
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token'    => ['required', 'string'],
            'email'    => ['required', 'email'],
            'password' => ['required', 'confirmed', PasswordRule::min(8)],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->password = $password;
                $user->save();
                $user->tokens()->delete();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json(['message' => 'Password reimpostata con successo.']);
        }

        return response()->json(['message' => 'Il link non è valido o è scaduto.'], 422);
    }
}
