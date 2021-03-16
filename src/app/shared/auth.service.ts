import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedIn = true;
  admin = true;

  constructor() {}

  logIn(login, password): void {
    // typiquement, acceptera en paramètres un login et un password
    // vérifier qu'ils sont ok, et si oui, positionner la propriété loggedIn à true
    // si login/password non valides, positionner à false;

    if (login === 'admin') { this.admin = true; }

    this.loggedIn = true;
  }

  logOut(): void {
    this.loggedIn = false;
    this.admin = false;
  }

  // exemple d'utilisation :
  // isAdmin.then(admin => { console.log("administrateur : " + admin);})
  isAdmin(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      resolve(this.admin);
    });
  }
}
