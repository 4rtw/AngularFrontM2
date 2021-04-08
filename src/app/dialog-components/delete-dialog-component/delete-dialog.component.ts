import {Component, OnDestroy, OnInit} from '@angular/core';
import {Assignment} from '../../shared/models/assignment.model';
import {Subscription} from 'rxjs';
import {AssignmentsService} from '../../shared/services/assignments.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
    selector: 'app-delete-confirm-popup-content',
    templateUrl: './delete-confirm-popup-content.html'
})
export class DeleteConfirmPopupComponent implements OnInit, OnDestroy {
    assignmentTransmis: Assignment;
    assignmentSub: Subscription;
    assignmentDeleteSub: Subscription;

    constructor(
        private assignmentsService: AssignmentsService,
        private router: Router,
        private route: ActivatedRoute,
        private snackbar: MatSnackBar) {
    }

    ngOnInit(): void {
        this.getAssignmentById();
    }

    getAssignmentById(): void {
        // les params sont des string, on va forcer la conversion
        // en number en mettant un "+" devant
        const id = Number(this.router.url.split('/', 3)[2]);

        console.log('Dans ngOnInit de details, id = ' + id + ' je suis ici');
        this.assignmentSub = this.assignmentsService.getAssignment(id).subscribe((assignment) => {
                this.assignmentTransmis = assignment;
            }
        );
    }

    onDelete(): void {
        this.assignmentDeleteSub = this.assignmentsService
            .deleteAssignment(this.assignmentTransmis)
            .subscribe((reponse) => {
                    console.log(reponse.message);

                    // on cache l'affichage du détail
                    this.assignmentTransmis = null;

                    // on affiche une notification
                    this.snackbar.open('Supprimé avec succès', 'OK', {
                        duration: 2000,
                    });

                    // et on navigue vers la page d'accueil qui affiche la liste
                    this.router.navigate(['/home']);
                },
                error => {
                    console.log(error);
                    this.snackbar.open('La suppression de l\'assignment a échoué', 'OK', {
                        duration: 2000, panelClass: ['mat-error']
                    });
                }
            );
        setTimeout(() => {
            this.assignmentDeleteSub.unsubscribe();
        }, 1000);
    }

    ngOnDestroy(): void {
        this.assignmentSub.unsubscribe();
    }
}
