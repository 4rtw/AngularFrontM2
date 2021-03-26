import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { AssignmentsService } from 'src/app/shared/assignments.service'
import { AuthService } from 'src/app/shared/auth.service'
import { Assignment } from '../assignment.model'
import {MatSnackBar} from '@angular/material/snack-bar'
import {MatDialog} from '@angular/material/dialog'

@Component({
  selector: 'app-assignment-detail',
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.css'],
})
export class AssignmentDetailComponent implements OnInit {
  // passé sous forme d'attribut HTML
  assignmentTransmis: Assignment

  constructor(
    private assignmentsService: AssignmentsService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAssignmentById()
  }

  getAssignmentById(): void {
    // les params sont des string, on va forcer la conversion
    // en number en mettant un "+" devant
    const id: number = +this.route.snapshot.params.id

    console.log('Dans ngOnInit de details, id = ' + id)
    this.assignmentsService.getAssignment(id).subscribe((assignment) => {
      this.assignmentTransmis = assignment
    })
  }

  onAssignmentRendu(): void {
    this.assignmentTransmis.rendu = true

    this.assignmentsService
      .updateAssignment(this.assignmentTransmis)
      .subscribe((reponse) => {
        console.log(reponse.message)
        // et on navigue vers la page d'accueil qui affiche la liste
        this.router.navigate(['/home'])
      })

    // this.assignmentTransmis = null
  }

  onClickEdit(): void {
    this.router.navigate(['/assignment', this.assignmentTransmis.id, 'edit'], {
      queryParams: {
        nom: 'Michel Buffa',
        metier: 'Professeur',
        responsable: 'MIAGE'
      },
      fragment: 'edition'
    })
  }

  popupDelete(): void{
    const dialogRef = this.dialog.open(DeleteConfirmPopupComponent)
  }
}


@Component({
  selector: 'app-delete-confirm-popup-content',
  templateUrl: './delete-confirm-popup-content.html'
})
export class DeleteConfirmPopupComponent implements OnInit{
  assignmentTransmis: Assignment
  constructor(
              private assignmentsService: AssignmentsService,
              private router: Router,
              private route: ActivatedRoute,
              private snackbar: MatSnackBar){}

  ngOnInit(): void {
    this.getAssignmentById()
  }

  getAssignmentById(): void {
    // les params sont des string, on va forcer la conversion
    // en number en mettant un "+" devant
    const id = Number(this.router.url.split('/', 3)[2])

    console.log('Dans ngOnInit de details, id = ' + id)
    this.assignmentsService.getAssignment(id).subscribe((assignment) => {
      this.assignmentTransmis = assignment
    })
  }

  onDelete(): void {
    this.assignmentsService
        .deleteAssignment(this.assignmentTransmis)
        .subscribe((reponse) => {
          console.log(reponse.message)
          const nom = this.assignmentTransmis.nom

          // on cache l'affichage du détail
          this.assignmentTransmis = null

          // et on navigue vers la page d'accueil qui affiche la liste
          this.router.navigate(['/home'])

          // on affiche une notification
          this.snackbar.open(nom + ' a été supprimé avec succès', 'OK', {
            duration: 2000,
          })
        })
  }
}
