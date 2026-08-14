# TODO

## Backend

- [X] `upload-file.ts` — corriger `crypto.randomUUID()` → `randomUUID()` + supprimer imports inutilisés (`writeFileSync`, `resolve`)
- [ ] `upload-file.ts` — ajouter le support des documents (pdf, doc...) en plus des images
- [ ] `triggers.sql` — ajouter trigger `delete_old_profile_photo` (AFTER UPDATE sur `account`) pour supprimer l'ancienne photo quand `profile_photo_id` change
- [ ] Route de changement de photo — supprimer l'ancien fichier physique (`/app/uploads/<file_name>`) après le UPDATE
- [ ] `passport.ts` — OAuth (Google, GitHub, 42)
- [ ] `add_users.ts` — script de création de comptes pour la démo
- [ ] `file-manager.ts` — nettoyage des fichiers orphelins
- [X] `my-profile.ts` — gérer le cas où le compte du token n'existe plus en base (retourne actuellement `res.json(undefined)` au lieu d'un 404)
- [X] `my-profile.ts` — utiliser le middleware `checkAuthToken` au lieu de dupliquer la vérification du JWT à la main
- [X] `login.ts` / `my-profile.ts` — filtrer `is_deleted = FALSE` dans les requêtes SQL (un compte soft-deleted peut encore se connecter / être lu)
- [X] `registration.ts` — valider que `birthdate` est une date valide (`isNaN(birth.getTime())`) avant de calculer l'âge : une date malformée contourne actuellement le contrôle de majorité (NaN < 18 === false)
- [ ] `complete-profile.ts` — **[sécu]** vérifier que `avatar` correspond à un fichier `type = 'default_avatar'` avant de l'insérer comme `profile_photo_id` (IDOR : permet actuellement de s'approprier la photo de n'importe quel compte tant que le `file_id` existe en base)
- [ ] Ajouter un rate-limit sur `/my-profile`, `/upload`, `/complete-profile`, `/logout` (seuls `/login` et `/register` en ont un actuellement)
- [ ] implement file manager (24h duration for files that are not profile photo)
- [X] fix frontend problems (register and login )
- [X] make responsive on login
- [X] make responsive on register
- [X] make responsive on offline header
- [X] make responsive on online header
- [X] draw some sketches for profile page and parameters page

## Frontend


- [ ] `login.tsx` / `register.tsx` — remplacer les URLs OAuth hardcodées (`https://localhost:8443/api/auth/...`) par des chemins relatifs (`/api/auth/...`)
- [X] `personal-page.tsx` — afficher les infos de `user` récupérées via `/api/my-profile` (le `<main>` est actuellement vide, rien n'est rendu après le fetch)
- [ ] `complete-profile.tsx` (register-and-login) — ajouter un `try/catch` autour des `fetch` (`/api/complete-profile` et `/api/upload`) : une exception réseau laisse le formulaire figé sans aucun message d'erreur
- [ ] `complete-profile.tsx` — ajouter un état `submitting` pour désactiver le bouton pendant la requête et empêcher le double-submit
- [ ] `complete-profile.tsx` — gérer l'échec de l'upload d'avatar quand le compte a déjà été créé : le `tmp_token` étant déjà supprimé à ce stade, l'utilisateur reste bloqué sans moyen de retry (soit naviguer vers `/personalpage` quand même, soit permettre de relancer uniquement `/api/upload`)

## Infrastructure

- [X] `nginx/default.conf` — HSTS ajouté ; pas de redirection HTTP→HTTPS : décision volontaire de n'exposer aucun port HTTP (sujet = "HTTPS must be used everywhere"), donc rien à rediriger
- [X] `nginx/default.conf` — headers de sécurité restants (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`)
- [ ] `nginx/default.conf` — `auth_request` sur `/uploads/` : **différé**, pas pertinent tant qu'il n'y a que des avatars (publics par nature) dedans ; à faire quand la messagerie ajoutera des pièces jointes privées (`file.type = 'message'`), en séparant les chemins (`/uploads/avatars/` public vs `/uploads/messages/` protégé) — sinon ça casse l'aperçu des avatars par défaut pendant l'inscription (`tmp_token` ≠ `token`, pas encore reconnu par `checkAuthToken`)
- [X] `nginx/default.conf` — ajouter `client_max_body_size` (défaut 1 Mo alors que le back accepte jusqu'à 5 Mo d'upload, les gros fichiers sont rejetés par nginx avant d'atteindre l'API)
