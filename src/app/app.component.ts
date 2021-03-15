import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AssignmentsService } from './shared/assignments.service';
import { AuthService } from './shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Gestion des assignments';
  isLogedIn: boolean;

  constructor(private router: Router,
              private assignmentsService: AssignmentsService) {}

  ngOnInit(): void{
    this.isLogedIn = false;
  }

  onConnecterClick(): void{
    this.router.navigate(['/login']);
  }

  peuplerBD(): void {
    // version naive et simple
    // this.assignmentsService.peuplerBD();

    // meilleure version :
    this.assignmentsService.peuplerBDAvecForkJoin()
      .subscribe(() => {
        console.log('LA BD A ETE PEUPLEE, TOUS LES ASSIGNMENTS AJOUTES, ON RE-AFFICHE LA LISTE');
        this.router.navigate(['/home'], {replaceUrl: true});
      });
  }

  onAjouterClick(): void {
    this.router.navigate(['/add']);
  }

  onLogoutClick(): void {
    this.isLogedIn = false;
  }
}
