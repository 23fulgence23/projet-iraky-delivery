<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Tymon\JWTAuth\Facades\JWTAuth;

class PiecesController extends Controller
{
    private function resoudre($v): array
    {
        if (!$v) {
            return ['data' => null, 'perdu' => false];
        }
        if (str_starts_with($v, 'data:')) {
            return ['data' => $v, 'perdu' => false];
        }
        // Ancien format : chemin de fichier sur le disque
        $d = Storage::disk('public');
        if ($d->exists($v)) {
            $mime = $d->mimeType($v) ?: 'image/jpeg';
            return ['data' => 'data:' . $mime . ';base64,' . base64_encode($d->get($v)), 'perdu' => false];
        }
        return ['data' => null, 'perdu' => true];
    }

    private function reponse(User $u)
    {
        return response()->json([
            'recto'      => $this->resoudre($u->photo_recto),
            'verso'      => $this->resoudre($u->photo_verso),
            'certificat' => $this->resoudre($u->certificat_residence),
        ]);
    }

    public function miennes()
    {
        $u = JWTAuth::user();
        if (!$u) {
            abort(401, 'Non authentifié.');
        }
        return $this->reponse($u);
    }

    public function duUtilisateur($id)
    {
        $a = JWTAuth::user();
        if (!$a || $a->role !== 'admin') {
            abort(403, 'Accès refusé.');
        }
        return $this->reponse(User::findOrFail($id));
    }
}
