import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, pairwise, tap, throttleTime } from 'rxjs/operators';
import { AssignmentsService } from '../shared/assignments.service';
import { Assignment } from './assignment.model';
import {CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css'],
})
export class AssignmentsComponent implements OnInit {
  assignments: Assignment[];
  page = 1;
  limit = 100;
  totalDocs: number;
  totalPages: number;
  hasPrevPage: boolean;
  prevPage: number;
  hasNextPage: boolean;
  nextPage: number;

  @ViewChild('scroller') scroller: CdkVirtualScrollViewport;

  // on injecte le service de gestion des assignments
  constructor(
    private assignmentsService: AssignmentsService,
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    console.log('AVANT AFFICHAGE');
    // on regarde s'il y a page= et limit = dans l'URL
    this.route.queryParams.subscribe((queryParams) => {
      console.log('Dans le subscribe des queryParams');
      this.page = +queryParams.page || 1;
      this.limit = +queryParams.limit || 10;

      this.getAssignments();
    });
    console.log('getAssignments() du service appelé');
  }

  getAssignments(): void {
    this.assignmentsService
      .getAssignmentsPagine(this.page, this.limit)
      .subscribe((data) => {
        this.assignments = data.data.docs;
        this.page = data.data.page;
        this.limit = data.data.limit;
        this.totalDocs = data.data.totalDocs;
        this.totalPages = data.data.totalPages;
        this.hasPrevPage = data.data.hasPrevPage;
        this.prevPage = data.data.prevPage;
        this.hasNextPage = data.data.hasNextPage;
        this.nextPage = data.data.nextPage;
        console.log('données reçues');
      });
  }

  getPlusDAssignmentsPourScrolling(): void {
    this.assignmentsService
      .getAssignmentsPagine(this.page, this.limit)
      .subscribe((data) => {
        // au lieu de remplacer this.assignments par les nouveaux assignments récupérés
        // on va les ajouter à ceux déjà présents...
        this.assignments = this.assignments.concat(data.data.docs);
        // this.assignments = [...this.assignments, ...data.docs];
        this.page = data.data.page;
        this.limit = data.data.limit;
        this.totalDocs = data.data.totalDocs;
        this.totalPages = data.data.totalPages;
        this.hasPrevPage = data.data.hasPrevPage;
        this.prevPage = data.data.prevPage;
        this.hasNextPage = data.data.hasNextPage;
        this.nextPage = data.data.nextPage;
        console.log('données reçues');
      });
  }

  ngAfterViewInit(): void {
    // Appelé automatiquement après l'affichage, donc l'élément scroller aura
    // et affiché et ne vaudra pas "undefined" (ce qui aurait été le cas dans ngOnInit)

    // On va s'abonner aux évenements de scroll sur le scrolling...
    this.scroller
      .elementScrolled()
      .pipe(
        map((event) => {
          return this.scroller.measureScrollOffset('bottom');
        }),
        pairwise(),
        /*
        tap(([y1, y2]) => {
          if(y2 < y1) {
            console.log("ON SCROLLE VERS LE BAS !")
          } else {
            console.log("ON SCROLLE VERS LE HAUT !")
          }
        }),
        */
        filter(([y1, y2]) => y2 < y1 && y2 < 200),
        throttleTime(200) // on ne va en fait envoyer le dernier événement que toutes les 200ms.
        // on va ignorer tous les évéments arrivés et ne garder que le dernier toutes
        // les 200ms
      )
      .subscribe((dist) => {
        this.ngZone.run(() => {
          if (this.hasNextPage) {
            this.page = this.nextPage;
            console.log(
              'Je charge de nouveaux assignments page = ' + this.page
            );
            this.getPlusDAssignmentsPourScrolling();
          }
        });
      });
  }

  onDeleteAssignment(event): void {
    // event = l'assignment à supprimer

    // this.assignments.splice(index, 1);
    this.assignmentsService.deleteAssignment(event).subscribe((message) => {
      console.log(message);
    });
  }

    /** Predicate function that only allows even numbers to be dropped into a list. */
    nonRenduPredicate(assignment: CdkDrag<Assignment>): boolean{
        return !assignment.data.rendu;
    }

    /** Predicate function that doesn't allow items to be dropped into a list. */
    noReturnPredicate(): boolean{
        return false;
    }

    drop = (event: CdkDragDrop<Assignment[], any>) => {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
        }
    }
}
