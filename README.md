# AssignmentApp

Ce projet a été réalisés par:

- 05 - ANDRIAMIHARIMANANA Ando Lalaina (Partie Front-end)
- 16 - RAFANOMEZANTSOA Fanilo Nomen’Aina (Partie Back-end)

## Lien Heroku du projet

- [Partie Front-end](https://angular-front-m12.herokuapp.com/)
- [Partie Back-end](https://backend-nodejs-m2-n-a.herokuapp.com/api/)

### Login

`username`: admin  
`password`: password

## Pour lancer l'application localement

### Prérequis

- [X] Node.js (LTS ou Current)
- [X] Angular CLI
- [X] La partie back-end du projet (Hébergé sur Héroku -> [ici](https://backend-nodejs-m2-n-a.herokuapp.com/api/), ou à
  déployer localement)

### Lancer le projet

- [X] Dans le fichier `package.json`, modifier la ligne `"start": "node server.js"` en `"start": "ng serve"`
- [X] Lancer la commande `npm install` pour installés les modules nécessaires
- [X] Lancer la commande `ng serve` pour lancer le serveur d'application
- [X] Rendez vous sur l'adresse `http://localhost:4200`

## Les fonctionnalités rajoutés (Côté Front-end)

- 05 - ANDRIAMIHARIMANANA Ando Lalaina
- [X] Utilisation du CDK `Drag and drop` de Angular sur le changement de status de "Rendus" et "Non Rendus", qui ne se
  déclenchera pas si l'utilisateur n'est pas authentifié
- [X] Améliorations visuelles:
    - `SnackBar`
    - `Indeterminate Progress Bar` sur la population de la Database
    - `Dialog` pour certaines confirmations/avertissements
    - `Form field`
    - `Menu`
    - `Card`
    - `Table`

- [X] L'enregistrement en tant qu'utilisateur sur l'application
- [X] Gestion des Users côté front end (CRUD)

Améliorations des parties:

- Gestion du token sur la partie Front-end du `Json Web Token (JWT)` pour l'authentification
- Connexion et déconnection automatique après `1 min 30 sec` d'inactivité
