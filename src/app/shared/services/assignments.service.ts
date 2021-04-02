import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Assignment } from '../models/assignment.model';
import { assignmentsGeneres } from '../data';
import {Data} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AssignmentsService {
  assignments: Assignment[];

  constructor(private http: HttpClient) { }

  uri = 'https://backend-nodejs-m2-n-a.herokuapp.com/api/assignments';
  // uri = 'http://localhost:8010/api/assignments'

  getAssignments(): Observable<Assignment[]> {
    console.log('Dans le service de gestion des assignments...');
    // return of(this.assignments)
    return this.http.get<Assignment[]>(this.uri);
  }

  getAssignmentsPagine(page: number, limit: number): Observable<any> {
    return this.http.get<Assignment[]>(this.uri + '?page=' + page + '&limit=' + limit);
  }
  getAssignmentsAsPromise(): Promise<Assignment[]> {
    console.log('Dans le service de gestion des assignments...');
    return this.http.get<Assignment[]>(this.uri).toPromise();
  }

  getAssignment(id: number): Observable<Assignment> {
    return this.http.get<Data>(this.uri + '/' + id)
    .pipe(
      map((a) => {
        return a.data;
      }),
      tap(a => {
        console.log('TRACE DANS TAP : j\'ai reçu ' + a.nom);
      }),
      catchError(this.handleError<any>('### catchError: getAssignments by id avec id=' + id))
    );
  }

  private handleError<T>(operation: any, result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);
      console.log(operation + ' a échoué ' + error.message);

      return of(result as T);
    };
  }

  generateId(): number {
    return Math.round(Math.random() * 100000);
  }

  addAssignment(assignment: Assignment): Observable<any> {
    assignment.id = this.generateId();

    return this.http.post(this.uri, assignment);
  }

  updateAssignment(assignment: Assignment): Observable<any> {

    return this.http.put(this.uri, assignment);
  }

  deleteAssignment(assignment: Assignment): Observable<any> {
    return this.http.delete(this.uri + '/' + assignment.id);
  }

  peuplerBD(): void{
    assignmentsGeneres.forEach(a => {
      const nouvelAssignment = new Assignment();
      nouvelAssignment.nom = a.nom;
      nouvelAssignment.id = a.id;
      nouvelAssignment.dateDeRendu = new Date(a.dateDeRendu);
      nouvelAssignment.rendu = a.rendu;

      this.addAssignment(nouvelAssignment)
      .subscribe(reponse => {
        console.log(reponse.message);
      });
    });
  }

  peuplerBDAvecForkJoin(): (Observable<any>) {
    const appelsVersAddAssignment = [];

    assignmentsGeneres.forEach((a) => {
      const nouvelAssignment = new Assignment();

      nouvelAssignment.id = a.id;
      nouvelAssignment.nom = a.nom;
      nouvelAssignment.dateDeRendu = new Date(a.dateDeRendu);
      nouvelAssignment.rendu = a.rendu;

      appelsVersAddAssignment.push(this.addAssignment(nouvelAssignment));
    });
    return forkJoin(appelsVersAddAssignment);
  }
}
