import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AssignmentsService} from 'src/app/shared/services/assignments.service';
import {Assignment} from '../../shared/models/assignment.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-edit-assigment',
    templateUrl: './edit-assigment.component.html',
    styleUrls: ['./edit-assigment.component.css']
})
export class EditAssigmentComponent implements OnInit, OnDestroy {
    assignment: Assignment;
    assignmentSub: Subscription[] = [];

    // pour le formulaire
    nom = '';
    dateDeRendu = null;
    isLinear = true;

    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;

    constructor(
        private assignmentsService: AssignmentsService,
        private route: ActivatedRoute,
        private router: Router,
        private snackBar: MatSnackBar,
        private _formBuilder: FormBuilder
    ) {
    }

    ngOnDestroy(): void {
        this.assignmentSub.forEach((subscription) => {
            subscription.unsubscribe();
        });
    }

    ngOnInit(): void {
        this.firstFormGroup = this._formBuilder.group({
            firstCtrl: ['', Validators.required]
        });
        this.secondFormGroup = this._formBuilder.group({
            secondCtrl: ['', Validators.required]
        });
        // ici on montre comment on peut récupérer les parametres http
        // par ex de :
        // http://localhost:4200/assignment/1/edit?nom=Michel%20Buffa&metier=Professeur&responsable=MIAGE#edition

        // console.log(this.route.snapshot.queryParams);
        // console.log(this.route.snapshot.fragment);

        this.getAssignmentById();
    }

    getAssignmentById(): void {
        // les params sont des string, on va forcer la conversion
        // en number en mettant un "+" devant
        const id: number = +this.route.snapshot.params.id;

        console.log('Dans ngOnInit de details, id = ' + id);
        this.assignmentSub.push(
            this.assignmentsService.getAssignment(id).subscribe((assignment) => {
                this.assignment = assignment;
                this.nom = assignment.nom;
                this.dateDeRendu = assignment.dateDeRendu;
            })
        );
    }


    onSubmit(event): void {
        // on va modifier l'assignment
        if ((!this.nom) || (!this.dateDeRendu)) {
            return;
        }

        this.assignment.nom = this.nom;
        this.assignment.dateDeRendu = this.dateDeRendu;
        const oldName = this.assignment.nom;

        this.assignmentSub.push(
            this.assignmentsService.updateAssignment(this.assignment)
                .subscribe(message => {
                        console.log(message.message);
                        // on affiche une notification
                        this.snackBar.open(oldName + ' a été modifié avec succès en ' + this.assignment.nom, 'OK', {
                            duration: 2000
                        });
                        // et on navigue vers la page d'accueil
                        this.router.navigate(['/home']);
                    },
                    error => {
                        console.log(error.message);
                        // on affiche une notification
                        this.snackBar.open('La modification de ' + oldName + ' a échoué ', 'OK', {
                            duration: 2000, panelClass: ['mat-error']
                        });
                    }
                )
        );

    }
}
