# TODO

## Backend

- [ ] `upload-file.ts` — corriger `crypto.randomUUID()` → `randomUUID()` + supprimer imports inutilisés (`writeFileSync`, `resolve`)
- [ ] `upload-file.ts` — ajouter le support des documents (pdf, doc...) en plus des images
- [ ] `triggers.sql` — ajouter trigger `delete_old_profile_photo` (AFTER UPDATE sur `account`) pour supprimer l'ancienne photo quand `profile_photo_id` change
- [ ] Route de changement de photo — supprimer l'ancien fichier physique (`/app/uploads/<file_name>`) après le UPDATE
- [ ] `passport.ts` — OAuth (Google, GitHub, 42)
- [ ] `add_users.ts` — script de création de comptes pour la démo
- [ ] `file-manager.ts` — nettoyage des fichiers orphelins

## Frontend

- [ ] `login.tsx` / `register.tsx` — remplacer les URLs OAuth hardcodées (`https://localhost:8443/api/auth/...`) par des chemins relatifs (`/api/auth/...`)

## Infrastructure

- [ ] `nginx/default.conf` — headers de sécurité + redirection HTTP → HTTPS + `auth_request` pour protéger `/uploads/`
