import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AssignmentsService} from 'src/app/shared/services/assignments.service';
import {Assignment} from '../../shared/models/assignment.model';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'app-add-assignment',
    templateUrl: './add-assignment.component.html',
    styleUrls: ['./add-assignment.component.css'],
})
export class AddAssignmentComponent implements OnInit {
    // Pour les champs du formulaire
    nom = '';
    dateDeRendu = null;

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

        this.assignmentsService.addAssignment(nouvelAssignment)
            .subscribe(reponse => {
                    console.log(reponse.message);
                    // puis on affiche une notiffication
                    this.snackBar.open(nouvelAssignment.nom + ' a été ajouté avec succès', 'OK', {
                        duration: 2000,
                    });
                },
                error => {
                    console.log(error.message);
                    this.snackBar.open('L\' ajout de l\'assignment ' + nouvelAssignment.nom + ' a échoué', 'OK', {
                        duration: 2000, panelClass: ['mat-error']
                    });
                },
                () => {
                    // et on navigue vers la page d'accueil qui affiche la liste
                    this.router.navigate(['/home']);
                }
            );
    }

}
