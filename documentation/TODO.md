# TODO

- [ ] fixes
    - [ ] onclick sur les icones 
    - [ ] boutons de langue dans le header en mode mobile
    - [X] boutons confirmer / anuler trop larges dans register
    - [ ] route /addfriend casse (`sendRequest is not a function`) : `<AddFriend />` rendu sans props `send`/`block` dans main.tsx:34 -> supprimer la route (a voir avec Nokha), + les `navigate("/addfriend")` dans personal-page.tsx:132 et :194
    - [ ] file-import.tsx : le XMLHttpRequest n'a pas de `onerror` (coupure reseau = aucun message)
    - [ ] parameters.tsx : l'avatar actuel n'est pas pre-selectionne au chargement (le profil n'est pas fetch au montage)

- [ ] footer 
    - [ ] terms of service (liens dans le footer mais routes /termsofservice et /privacypolicy absentes de main.tsx)
    - [ ] ugc
    - [X] langage switch

- [X] make search bar
    - [X] add list
    - [X] make result
    - [X] other users profile page (/profile/:pseudo)
    - [X] debounce
    - [X] fetch
    - [X] scss
    - [ ] .search-bar sans background-color (fond hérité de la page, potentiellement invisible/moche)

- [ ] online status
    - [X] socket global + onlineFriends dans auth-context
    - [X] useFriendships + 3 etats (online / offline / not-friend) : FriendCard, personal-page, search-bar, ChatItem
    - [ ] bonus : deconnecter le socket d'un onglet inactif quand le JWT expire (checkAuth doit renvoyer `exp`, le front fait un setTimeout)

- [ ] backend
    - [ ] delete isdeleted row in user table
    - [ ] tsconfig.json incompatible TS 7 : retirer `baseUrl`, `paths` -> `"./src/*"`

- [ ] typescript (`docker exec frontend npx tsc --noEmit -p .` = 45 erreurs)
    - [ ] TS2786 RequireAuth / GuestOnly dans main.tsx
    - [ ] my-friends.tsx : reponses `unknown` pas typees
    - [ ] messages/ : main-page.tsx, new-chat.tsx, send-file.tsx (props manquantes, any implicites)
    - [ ] header-online.tsx:83 : props de la search bar
    - [ ] game/gomoku/GamePage.tsx

- [ ] scss refacto

- [ ] bootstrap cleaning

- [ ] check all responsive

- [ ] security check

- [ ] console warnings/errors (sujet: "No warnings or errors")
    - [ ] search-bar : 400 au chargement (query vide envoyée au montage, pas de check `input` vide avant le fetch)
    - [ ] favicon.ico absent de public/

- [ ] si on a le temps
    - [ ] preview pdf via pdf.js (canvas, évite X-Frame-Options)

- [ ] check translation everywhere

- [ ] reponsive:
    - [ ] searchbar 
    - [ ] messages
    - [ ] personal page
    - [ ] my friends
    - [ ] footer
    - [ ] header
    - [ ] file import
    - [ ] search results list

- [ ] online status everywhere
- [ ] useless stuff cleaning
- [ ] adapt online status with new friendship system 
