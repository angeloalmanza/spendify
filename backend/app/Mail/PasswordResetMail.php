<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PasswordResetMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public string $resetUrl
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Reimposta la tua password — Spendify',
        );
    }

    public function content(): Content
    {
        $name = htmlspecialchars($this->user->name);
        $url  = htmlspecialchars($this->resetUrl);

        $html = <<<HTML
        <!DOCTYPE html>
        <html lang="it">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reimposta la tua password</title>
        </head>
        <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f1f5f9;margin:0;padding:40px 16px;">
            <div style="background:#ffffff;border-radius:16px;max-width:480px;margin:0 auto;padding:40px;">
                <div style="font-size:24px;font-weight:700;color:#6366f1;margin-bottom:8px;">Spendify</div>
                <h1 style="font-size:20px;font-weight:600;color:#1e293b;margin:0 0 12px;">Reimposta la tua password</h1>
                <p style="font-size:15px;color:#475569;line-height:1.6;margin:0 0 24px;">Ciao {$name}, abbiamo ricevuto una richiesta per reimpostare la password del tuo account.</p>
                <a href="{$url}" style="display:inline-block;background:#6366f1;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:600;font-size:15px;">Reimposta password</a>
                <p style="font-size:15px;color:#475569;line-height:1.6;margin:24px 0 0;">Il link scade tra <strong>60 minuti</strong>. Se non hai richiesto il reset, ignora questa email.</p>
                <div style="margin-top:32px;font-size:13px;color:#94a3b8;">
                    Se il bottone non funziona, copia e incolla questo link nel browser:<br>
                    <span style="word-break:break-all;">{$url}</span>
                </div>
            </div>
        </body>
        </html>
        HTML;

        return new Content(htmlString: $html);
    }
}
