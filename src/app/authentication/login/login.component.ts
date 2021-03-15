import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../shared/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;

  constructor(private authService: AuthService,private router: Router) { }

  ngOnInit(): void {
  }

  onRegisterClick(): void {
    this.router.navigate(['/register']);
    console.log('register here redirected');
  }

  login(): void {
    // si je suis pas loggé, je me loggue, sinon, si je suis
    // loggé je me déloggue et j'affiche la page d'accueil

    if (this.authService.loggedIn) {
      // je suis loggé
      // et bien on se déloggue
      this.authService.logOut();
      // on navigue vers la page d'accueil
      this.router.navigate(['/home']);
    } else {
      // je ne suis pas loggé, je me loggue
      this.authService.logIn('admin', 'toto');
    }
  }

  onSubmit($event: Event) {

  }
}
