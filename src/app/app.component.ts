import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AssignmentsService } from './shared/services/assignments.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import { UserIdleService } from 'angular-user-idle';
import { tapOnce } from './shared/utils/custom-operators';
import { JwtService } from './shared/services/jwt.service';
import { AuthService } from './shared/services/auth.service';
import { config } from './shared/configs/config';
import { Subscription } from 'rxjs';

export interface DialogData {
  idleTime_min: number;
  idleTime_sec: number;
  beforeTimeout: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  dialogRef: any;

  title         = 'Gestion des assignments';
  idleTime      = config.idle;
  isLoggedIn    = false;
  beforeTimeout = config.timeout;

  sub_timeout: Subscription;
  sub_timeStart: Subscription;

  constructor(
      private userIdle: UserIdleService,
      private router: Router,
      private jwtService: JwtService,
      private authService: AuthService,
      public dialog: MatDialog
  ) {}

  ngOnInit() {
    console.log(this.jwtService.isLoggedIn);
    if (this.jwtService.isLoggedIn) {
      this.userIdle.startWatching();

      this.sub_timeStart = this.userIdle.onTimerStart().pipe(
        tapOnce(_ => this.openDialog()),
      ).subscribe(count => {
        if (!this.dialogRef.componentInstance) {
          this.openDialog();
        }
        this.dialogRef.componentInstance.data = {
          idleTime_min: Math.floor(this.idleTime / 60),
          idleTime_sec: this.idleTime % 60,
          beforeTimeout: this.beforeTimeout - (count as number)};
      });

      this.sub_timeout = this.userIdle.onTimeout().subscribe(_ => {
        this.authService.logOut().subscribe(_ => {
          this.dialogRef.close();
          this.userIdle.stopTimer();
          this.userIdle.stopWatching();
          this.router.navigate(['/login']);
        });
      });
    }

    this.isLoggedIn = this.jwtService.isLoggedIn;
  }

  ngOnDestroy(): void {
    this.sub_timeStart?.unsubscribe();
    this.sub_timeout?.unsubscribe();
  }

  openDialog(): void {
    this.dialogRef = this.dialog.open(IdleDialogComponent, {
      width: '400px',
      data: {idleTime: this.idleTime, beforeTimeout: this.beforeTimeout}
    });
  }


  /* ---------------------MILA HATSARAINA--------------------------------- */
  onConnecterClick(): void{
    this.router.navigate(['/login']);
  }

  onAjouterClick(): void {
    this.router.navigate(['/add']);
  }

  onLogoutClick(): void {
    this.isLoggedIn = false;

    this.authService.logOut().subscribe(_ => {
      this.router.navigate(['/']);
      location.reload();
    });
  }

  popupPeuplerBD(): void {
    this.dialog.open(PeuplerDBDialogComponent);
  }
  /* ------------------------------------------------------------------- */
}


@Component({
  selector: 'app-dialog-popup-content',
  templateUrl: 'peuplerDB-dialog-popup-content.html',
  styleUrls: ['./app.component.css']
})
export class PeuplerDBDialogComponent{
  isBegin: boolean;

  constructor(private assignmentsService: AssignmentsService,
              private router: Router,
              private snackBar: MatSnackBar) {}

  peuplerBD(): void {
    // version naive et simple
    // this.assignmentsService.peuplerBD()

    this.isBegin = true;
    // meilleure version :
    this.assignmentsService.peuplerBDAvecForkJoin()
        .subscribe(() => {
          console.log('LA BD A ETE PEUPLEE, TOUS LES ASSIGNMENTS AJOUTES, ON RE-AFFICHE LA LISTE');
          this.router.navigate(['/home'], {replaceUrl: true});
          this.snackBar.open('LA BD A ETE PEUPLEE, TOUS LES ASSIGNMENTS AJOUTES', 'OK');
        });

    setTimeout( () => { this.isBegin = false; }, 1000);
  }
}

@Component({
  selector: 'app-idle-dialog-content',
  templateUrl: 'idle-dialog-content.html',
  styleUrls: ['./app.component.css']
})
export class IdleDialogComponent implements OnDestroy{

  sub_loggout: Subscription;

  constructor(
      private userIdle: UserIdleService,
      private router: Router,
      private authService: AuthService,
      public dialogRef: MatDialogRef<IdleDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnDestroy(): void {
    this.sub_loggout?.unsubscribe();
    location.reload();
  }

  onNoClick(): void {
    this.sub_loggout = this.authService.logOut().subscribe(_ => {
      this.dialogRef.close();
      this.userIdle.stopTimer();
      this.userIdle.stopWatching();
      this.router.navigate(['/login']).then(() => location.reload());
    });
  }

  onStayClick(): void {
    this.dialogRef.close();
    this.userIdle.stopTimer();
    this.userIdle.resetTimer();
  }
}
