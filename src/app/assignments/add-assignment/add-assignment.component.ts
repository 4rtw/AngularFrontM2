import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AssignmentsService} from 'src/app/shared/services/assignments.service';
import {Assignment} from '../../shared/models/assignment.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-add-assignment',
    templateUrl: './add-assignment.component.html',
    styleUrls: ['./add-assignment.component.css'],
})
export class AddAssignmentComponent implements OnInit, OnDestroy {
    // Pour les champs du formulaire
    nom = '';
    dateDeRendu = null;
    addAssignmentSub: Subscription;

    constructor(private assignmentsService: AssignmentsService,
                private router: Router,
                private snackBar: MatSnackBar) {
    }

    ngOnInit(): void {
    }

    onSubmit(event): void {
        if ((!this.nom) || (!this.dateDeRendu)) {
            return;
        }

        const nouvelAssignment = new Assignment();
        nouvelAssignment.nom = this.nom;
        nouvelAssignment.dateDeRendu = this.dateDeRendu;
        nouvelAssignment.rendu = false;

        this.addAssignmentSub = this.assignmentsService.addAssignment(nouvelAssignment)
            .subscribe(reponse => {
                    console.log(reponse.message);
                    // puis on affiche une notiffication
                    this.snackBar.open(nouvelAssignment.nom + ' a été ajouté avec succès', 'OK', {
                        duration: 2000,
                    });
                    this.router.navigate(['/home']);
                },
                error => {
                    console.log(error.message);
                    this.snackBar.open('L\' ajout de l\'assignment ' + nouvelAssignment.nom + ' a échoué', 'OK', {
                        duration: 2000, panelClass: ['mat-error']
                    });
                }
            );
    }

    ngOnDestroy(): void {
        this.addAssignmentSub.unsubscribe();
    }

}
