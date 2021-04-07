import {Injectable} from '@angular/core';
import {Users} from '../models/user.model';
import {Data} from '@angular/router';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    users: Users[];
    uri = 'https://backend-nodejs-m2-n-a.herokuapp.com/api/users';
    uriForAdd = 'https://backend-nodejs-m2-n-a.herokuapp.com/api/authentifications/register';

    constructor(
        private http: HttpClient
    ) {
    }

    // uri = 'http://localhost:8010/api/users'
    // uriForAdd = 'http://localhost:8010/api/authentifications/register'

    getUsersPagine(page: number, limit: number): Observable<any> {
        return this.http.get<Users>(this.uri + '?page=' + page + '&limit=' + limit);
    }

    getUser(id: number): Observable<Users> {
        return this.http.get<Data>(this.uri + '/' + id)
            .pipe(
                map((a) => {
                    return a.data;
                }),
                tap((a) => {
                    console.log('TRACE DANS TAP: j\'ai reçu ' + a.nom);
                }),
                catchError(this.handleError<any>('### catchError: getUser by id avec id = ' + id))
            );
    }

    generateId(): number {
        return Math.round(Math.random() * 100000);
    }

    addUser(user: Users): Observable<any> {
        user.id = this.generateId();
        return this.http.post(this.uriForAdd, user);
    }

    updateUser(user: Users): Observable<any> {
        return this.http.put(this.uri, user);
    }

    deleteUser(user: Users): Observable<any> {
        return this.http.delete(this.uri + '/' + user.id);
    }

    private handleError<T>(operation: any, result?: T) {
        return (error: any): Observable<T> => {
            console.log(error); // pour afficher dans la console
            console.log(operation + ' a échoué ' + error.message);

            return of(result as T);
        };
    }
}
