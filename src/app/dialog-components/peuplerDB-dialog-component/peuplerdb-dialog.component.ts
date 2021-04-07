import {Component, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {AssignmentsService} from '../../shared/services/assignments.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'app-dialog-popup-content',
    templateUrl: 'peuplerDB-dialog-popup-content.html',
    styleUrls: ['../../app.component.css']
})
export class PeuplerDBDialogComponent implements OnDestroy {
    isBegin: boolean;
    assignmentSub: Subscription;

    constructor(private assignmentsService: AssignmentsService,
                private router: Router,
                private snackBar: MatSnackBar) {
    }

    peuplerBD(): void {
        // version naive et simple
        // this.assignmentsService.peuplerBD()

        this.isBegin = true;
        // meilleure version :
        this.assignmentSub = this.assignmentsService.peuplerBDAvecForkJoin()
            .subscribe(() => {
                    console.log('LA BD A ETE PEUPLEE, TOUS LES ASSIGNMENTS AJOUTES, ON RE-AFFICHE LA LISTE');
                    this.router.navigate(['/home'], {replaceUrl: true});
                    this.snackBar.open('LA BD A ETE PEUPLEE, TOUS LES ASSIGNMENTS AJOUTES', 'OK');
                }
            );

        setTimeout(() => {
            this.isBegin = false;
        }, 1000);
    }

    ngOnDestroy(): void {
        this.assignmentSub.unsubscribe();
    }
}
