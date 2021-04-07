import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {UserIdleService} from 'angular-user-idle';
import {tapOnce} from './shared/utils/custom-operators';
import {JwtService} from './shared/services/jwt.service';
import {AuthService} from './shared/services/auth.service';
import {config} from './shared/configs/config';
import {Subscription} from 'rxjs';
import {PeuplerDBDialogComponent} from './dialog-components/peuplerDB-dialog-component/peuplerdb-dialog.component';
import {IdleDialogComponent} from './dialog-components/idle-dialog-component/idle-dialog.component';

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
export class AppComponent implements OnInit, OnDestroy {

    static isLoggedIn: boolean;
    assignmentSub: Subscription[] = [];
    dialogRef: any;

    title = 'Gestion des assignments';
    idleTime = config.idle;
    isLoggedIn = false;
    beforeTimeout = config.timeout;

    sub_timeout: Subscription;
    sub_timeStart: Subscription;

    constructor(
        private userIdle: UserIdleService,
        private router: Router,
        private jwtService: JwtService,
        private authService: AuthService,
        public dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
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
                    beforeTimeout: this.beforeTimeout - (count as number)
                };
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
        this.assignmentSub.forEach((subscription) => {
            subscription.unsubscribe();
        });
    }

    openDialog(): void {
        this.dialogRef = this.dialog.open(IdleDialogComponent, {
            width: '400px',
            data: {idleTime: this.idleTime, beforeTimeout: this.beforeTimeout}
        });
    }


    onConnecterClick(): void {
        this.router.navigate(['/login']);
    }

    // TODO: Boutton Ajouter
    onAjouterClick(): void {
        this.router.navigate(['/add']);
    }

    onLogoutClick(): void {
        this.isLoggedIn = false;

        this.assignmentSub.push(
            this.authService.logOut().subscribe(_ => {
                this.router.navigate(['/']);
                location.reload();
            })
        );
    }

    popupPeuplerBD(): void {
        this.dialog.open(PeuplerDBDialogComponent);
    }

}
