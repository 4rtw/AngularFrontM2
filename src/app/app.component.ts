import {Component, destroyPlatform, OnInit} from '@angular/core'
import { Router } from '@angular/router'
import { AssignmentsService } from './shared/assignments.service'
import {MatDialog} from '@angular/material/dialog'
import { AuthService } from './shared/auth.service'
import {MatSnackBar} from '@angular/material/snack-bar'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Gestion des assignments'
  isLogedIn: boolean

  constructor(private router: Router,
              public dialog: MatDialog) { }

  ngOnInit = (): void => {
    this.isLogedIn = false
  }

  onConnecterClick(): void{
    this.router.navigate(['/login'])
  }

  onAjouterClick(): void {
    this.router.navigate(['/add'])
  }

  onLogoutClick(): void {
    this.isLogedIn = false
  }

  popupPeuplerBD(): void {
    const dialogRef = this.dialog.open(DialogPopupContentComponent)
  }
}


@Component({
  selector: 'app-dialog-popup-content',
  templateUrl: 'add-assignments-dialog-popup-content.html',
  styleUrls: ['./app.component.css']
})
export class DialogPopupContentComponent{
  isBegin: boolean

  constructor(private assignmentsService: AssignmentsService,
              private router: Router,
              private snackBar: MatSnackBar) {}

  peuplerBD(): void {
    // version naive et simple
    // this.assignmentsService.peuplerBD()

    this.isBegin = true
    // meilleure version :
    this.assignmentsService.peuplerBDAvecForkJoin()
        .subscribe(() => {
          console.log('LA BD A ETE PEUPLEE, TOUS LES ASSIGNMENTS AJOUTES, ON RE-AFFICHE LA LISTE')
          this.router.navigate(['/home'], {replaceUrl: true})
          this.snackBar.open('LA BD A ETE PEUPLEE, TOUS LES ASSIGNMENTS AJOUTES', 'OK')
        })

    setTimeout( () => { this.isBegin = false }, 1000)
  }
}
