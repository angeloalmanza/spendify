<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reimposta la tua password</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f1f5f9; margin: 0; padding: 40px 16px; }
        .card { background: #ffffff; border-radius: 16px; max-width: 480px; margin: 0 auto; padding: 40px; }
        .logo { font-size: 24px; font-weight: 700; color: #6366f1; margin-bottom: 8px; }
        h1 { font-size: 20px; font-weight: 600; color: #1e293b; margin: 0 0 12px; }
        p { font-size: 15px; color: #475569; line-height: 1.6; margin: 0 0 24px; }
        .btn { display: inline-block; background: #6366f1; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 600; font-size: 15px; }
        .footer { margin-top: 32px; font-size: 13px; color: #94a3b8; }
        .url { word-break: break-all; font-size: 13px; color: #94a3b8; margin-top: 16px; }
    </style>
</head>
<body>
    <div class="card">
        <div class="logo">Spendify</div>
        <h1>Reimposta la tua password</h1>
        <p>Ciao {{ $user->name }}, abbiamo ricevuto una richiesta per reimpostare la password del tuo account.</p>
        <a href="{{ $resetUrl }}" class="btn">Reimposta password</a>
        <p style="margin-top: 24px;">Il link scade tra <strong>60 minuti</strong>. Se non hai richiesto il reset, ignora questa email.</p>
        <div class="footer">
            Se il bottone non funziona, copia e incolla questo link nel browser:
            <div class="url">{{ $resetUrl }}</div>
        </div>
    </div>
</body>
</html>
