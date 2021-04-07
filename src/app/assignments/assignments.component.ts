import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {filter, map, pairwise, throttleTime} from 'rxjs/operators';
import {AssignmentsService} from '../shared/services/assignments.service';
import {Assignment} from '../shared/models/assignment.model';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';
import {JwtService} from '../shared/services/jwt.service';

@Component({
    selector: 'app-assignments',
    templateUrl: './assignments.component.html',
    styleUrls: ['./assignments.component.css'],
})
export class AssignmentsComponent implements OnInit, OnDestroy {
    assignments: Assignment[];
    assignmentsRendus: Assignment[] = [];
    assignmentsNonRendus: Assignment[] = [];
    assignmentSub: Subscription[] = [];
    dragAndDropSwitch: boolean;
    page = 1;
    limit = 100;
    totalDocs: number;
    totalPages: number;
    hasPrevPage: boolean;
    prevPage: number;
    hasNextPage: boolean;
    nextPage: number;

    @ViewChild('scrollerRendu') scrollerRendu: CdkVirtualScrollViewport;
    @ViewChild('scrollerNonRendu') scrollerNonRendu: CdkVirtualScrollViewport;

    // on injecte le service de gestion des assignments
    constructor(
        private assignmentsService: AssignmentsService,
        private route: ActivatedRoute,
        private router: Router,
        private ngZone: NgZone,
        private snackBar: MatSnackBar,
        private jwtService: JwtService
    ) {
    }

    ngOnInit(): void {
        // on regarde s'il y a page= et limit = dans l'URL
        this.assignmentSub.push(
            this.route.queryParams.subscribe((queryParams) => {
                this.page = +queryParams.page || 1;
                this.limit = +queryParams.limit || 10;

                this.getAssignments();
            })
        );

        this.dragAndDropSwitch = !this.jwtService.isLoggedIn;

    }

    getAssignments(): void {
        this.assignmentSub.push(
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

                    this.assignmentsNonRendus = this.assignments.filter(item => item.rendu === false);
                    this.assignmentsRendus = this.assignments.filter(item => item.rendu === true);
                    this.checkIfEnoughtItems();
                })
        );
    }

    getPlusDAssignmentsPourScrolling(): void {
        this.assignmentSub.push(
            this.assignmentsService
                .getAssignmentsPagine(this.page, this.limit)
                .subscribe((data) => {
                        // au lieu de remplacer this.assignments par les nouveaux assignments récupérés
                        // on va les ajouter à ceux déjà présents...
                        this.assignments = this.assignments.concat(data.data.docs);
                        // this.assignments = [...this.assignments, ...data.docs]
                        this.page = data.data.page;
                        this.limit = data.data.limit;
                        this.totalDocs = data.data.totalDocs;
                        this.totalPages = data.data.totalPages;
                        this.hasPrevPage = data.data.hasPrevPage;
                        this.prevPage = data.data.prevPage;
                        this.hasNextPage = data.data.hasNextPage;
                        this.nextPage = data.data.nextPage;
                        this.assignmentsNonRendus = this.assignments.filter(item => item.rendu === false);
                        this.assignmentsRendus = this.assignments.filter(item => item.rendu === true);
                    }
                )
        );
    }

    getNextData(): void {
        this.ngZone.run(() => {
            if (this.hasNextPage) {
                this.page = this.nextPage;
                this.getPlusDAssignmentsPourScrolling();
            }
        });
    }

    checkIfEnoughtItems(): void {
        if (this.assignmentsNonRendus.length <= 11 || this.assignmentsRendus.length <= 11) {
            this.getNextData();
        }
    }

    onScrollList(scroller: CdkVirtualScrollViewport): void {
        this.assignmentSub.push(
            scroller
                .elementScrolled()
                .pipe(
                    map((event) => {
                        return scroller.measureScrollOffset('bottom');
                    }),
                    pairwise(),
                    filter(([y1, y2]) => y2 < y1 && y2 < 200),
                    throttleTime(200)
                    // on ne va en fait envoyer le dernier événement que toutes les 200ms.
                    // on va ignorer tous les évéments arrivés et ne garder que le dernier toutes
                    // les 200ms
                )
                .subscribe((dist) => {
                        this.getNextData();
                    }
                )
        );
    }

    /*
    * Appelé automatiquement après l'affichage, donc l'élément scroller aura
    *  et affiché et ne vaudra pas "undefined" (ce qui aurait été le cas dans ngOnInit)
    * On va s'abonner aux évenements de scroll sur le scrolling...
    */
    ngAfterViewInit(): void {
        this.onScrollList(this.scrollerRendu);
        this.onScrollList(this.scrollerNonRendu);
    }

    onDeleteAssignment(event): void {
        // event = l'assignment à supprimer

        // this.assignments.splice(index, 1)
        this.assignmentSub.push(
            this.assignmentsService.deleteAssignment(event)
                .subscribe((message) => {
                    console.log(message);
                })
        );
    }

    drop(event: CdkDragDrop<Assignment[]>): void {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {

            /* https://stackoverflow.com/questions/58206928/how-can-i-get-dragged-item-data-in-metarial-drag-and-drop
             * A permi de récupérer l'assignment dans la liste du drag and drop
             * en l'occurence event.item.data qui sera de type Assignment
             * Il faut aussi rajouter [cdkDragData] dans la partie html, qui précise l'élément qu'on veut récupérer
             * */
            const theAssignment = new Assignment();
            theAssignment._id = event.item.data._id;
            theAssignment.id = event.item.data.id;
            theAssignment.nom = event.item.data.nom;
            theAssignment.dateDeRendu = event.item.data.dateDeRendu;
            //    Pour l'assignment dans la DB
            theAssignment.rendu = !event.item.data.rendu;
            //    Pour l'assignment dans la liste locale
            event.item.data.rendu = !event.item.data.rendu;

            this.checkIfEnoughtItems();

            this.assignmentSub.push(
                this.assignmentsService.updateAssignment(theAssignment).subscribe(
                    message => {
                        console.log(message);
                        const rendu = event.item.data.rendu ? 'rendu avec succes' : 'non rendu';
                        this.snackBar.open('Assignment ' + rendu, 'OK', {
                            duration: 2000,
                        });
                    },
                    error => {
                        console.log(error.message);
                        this.snackBar.open('Transfert de l\'assignment échoué', 'OK', {
                            duration: 2000, panelClass: ['mat-error']
                        });
                    }
                )
            );

            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
        }
    }

    ngOnDestroy(): void {
        this.assignmentSub.forEach((subscription) => {
            subscription.unsubscribe();
        });
    }
}
