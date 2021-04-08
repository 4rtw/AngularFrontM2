import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AssignmentsService} from 'src/app/shared/services/assignments.service';
import {Assignment} from '../../shared/models/assignment.model';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {DeleteConfirmPopupComponent} from '../../dialog-components/delete-dialog-component/delete-dialog.component';

@Component({
    selector: 'app-assignment-detail',
    templateUrl: './assignment-detail.component.html',
    styleUrls: ['./assignment-detail.component.css'],
})
export class AssignmentDetailComponent implements OnInit, OnDestroy {
    // passé sous forme d'attribut HTML
    assignmentTransmis: Assignment;
    assignmentSub: Subscription[] = [];

    constructor(
        private assignmentsService: AssignmentsService,
        private route: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
        this.getAssignmentById();
    }

    ngOnDestroy(): void {
        this.assignmentSub.forEach((subscription) => {
            subscription.unsubscribe();
        });
    }

    getAssignmentById(): void {
        // les params sont des string, on va forcer la conversion
        // en number en mettant un "+" devant
        const id: number = +this.route.snapshot.params.id;

        console.log('Dans ngOnInit de details, id = ' + id);
        this.assignmentSub.push(
            this.assignmentsService.getAssignment(id).subscribe((assignment) => {
                this.assignmentTransmis = assignment;
            })
        );
    }

    onAssignmentRendu(): void {
        this.assignmentTransmis.rendu = true;

        this.assignmentSub.push(
            this.assignmentsService
                .updateAssignment(this.assignmentTransmis)
                .subscribe((reponse) => {
                    console.log(reponse.message);
                    // et on navigue vers la page d'accueil qui affiche la liste
                    this.router.navigate(['/home']);
                })
        );

        // this.assignmentTransmis = null
    }

    onClickEdit(): void {
        this.router.navigate(['/assignment', this.assignmentTransmis.id, 'edit']);
    }

    popupDelete(): void {
        this.dialog.open(DeleteConfirmPopupComponent);
    }
}
