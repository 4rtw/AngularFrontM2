import {Component, Inject, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {UserIdleService} from 'angular-user-idle';
import {Router} from '@angular/router';
import {AuthService} from '../../shared/services/auth.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogData} from '../../app.component';

@Component({
    selector: 'app-idle-dialog-content',
    templateUrl: 'idle-dialog-content.html',
    styleUrls: ['../../app.component.css']
})
export class IdleDialogComponent implements OnDestroy {

    sub_loggout: Subscription;

    constructor(
        private userIdle: UserIdleService,
        private router: Router,
        private authService: AuthService,
        public dialogRef: MatDialogRef<IdleDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {
    }

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
