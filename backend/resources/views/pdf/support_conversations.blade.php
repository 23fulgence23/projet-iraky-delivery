<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
    body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #222; }
    h1 { color: #b8860b; font-size: 20px; margin-bottom: 2px; }
    .meta { color: #666; font-size: 11px; margin-bottom: 24px; }
    .client-block { margin-bottom: 26px; page-break-inside: avoid; }
    .client-header {
        background-color: #f5e6b8; padding: 8px 12px; border-radius: 4px;
        font-weight: bold; font-size: 13px; margin-bottom: 8px;
    }
    .msg { padding: 6px 10px; margin-bottom: 4px; border-radius: 4px; }
    .msg-client { background-color: #eef2ff; border-left: 3px solid #3b82f6; }
    .msg-admin  { background-color: #f4f4f4; border-left: 3px solid #888; }
    .msg-role   { font-size: 10px; font-weight: bold; color: #555; }
    .msg-date   { font-size: 9px; color: #999; float: right; }
    .msg-texte  { margin-top: 2px; }
    .footer { margin-top: 30px; font-size: 9px; color: #aaa; text-align: center; }
</style>
</head>
<body>

    <h1>IRAKY Delivery — Conversations Support</h1>
    <div class="meta">Export de sécurité généré le {{ $genereLe }} — {{ $conversations->count() }} conversation(s)</div>

    @forelse($conversations as $clientId => $messages)
        @php $client = $messages->first()->client; @endphp
        <div class="client-block">
            <div class="client-header">
                {{ $client->prenom ?? '' }} {{ $client->nom ?? '' }}
                — {{ $client->email ?? 'email inconnu' }}
                @if($client->telephone) — {{ $client->telephone }} @endif
                (ID client #{{ $clientId }})
            </div>

            @foreach($messages as $m)
                <div class="msg {{ $m->sender_role === 'client' ? 'msg-client' : 'msg-admin' }}">
                    <span class="msg-date">{{ \Carbon\Carbon::parse($m->created_at)->format('d/m/Y H:i') }}</span>
                    <span class="msg-role">
                        {{ $m->sender_role === 'client' ? '👤 Client' : ($m->sender_id ? '🧑‍💼 Admin' : '🤖 Assistant automatique') }}
                    </span>
                    <div class="msg-texte">{{ $m->texte }}</div>
                </div>
            @endforeach
        </div>
    @empty
        <p>Aucune conversation enregistrée.</p>
    @endforelse

    <div class="footer">Document confidentiel — IRAKY Delivery — usage interne uniquement</div>

</body>
</html>