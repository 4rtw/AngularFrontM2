import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, of, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {JwtService} from './jwt.service';
import {LocalStorageService} from './local-storage.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    uri = 'https://backend-nodejs-m2-n-a.herokuapp.com/api/authentifications/';
    tokenUri = 'https://backend-nodejs-m2-n-a.herokuapp.com/api/token/';

    // uri = 'http://localhost:8010/api/authentifications/'
    // tokenUri = 'http://localhost:8010/api/token/'


    constructor(
        private http: HttpClient,
        private persistenceManager: LocalStorageService,
        private jwtService: JwtService,
        private router: Router) {
    }

    logIn(username: string, password: string): Observable<any> {
        return this.http.post<any>(this.uri + 'login', {utilisateur: username, motDePasse: password})
            .pipe(
                map(x => {
                    return {message: x.message, data: x.data[0]};
                }),
                tap(x => {
                    const succed = this.persistenceManager.set('payload', x.data);
                    if (succed) {
                        this.jwtService.setToken(x.data.access_token);
                    }
                }),
                catchError(this.handleError<any>())
            );
    }

    logOut(): Observable<any> {
        const decoded = this.jwtService.decoded;
        if (decoded) {
            return this.http.post<any>(this.uri + 'logout', {utilisateur: decoded.utilisateur})
                .pipe(
                    map(x => {
                        return {message: x.message};
                    }),
                    tap(_ => {
                        const succed = this.persistenceManager.remove('payload');
                        if (succed) {
                            this.jwtService.reset();
                        }
                    }),
                    catchError(this.handleError<any>())
                );
        }
        return throwError('Vous ne pouvez plus appelez logOut() car vous êtes déjà déconnectés');
    }

    refreshToken(): Observable<any> {
        if (this.jwtService.isTokenExpired && this.jwtService.jwtToken) {
            const payload = this.persistenceManager.get('payload');
            if (payload) {
                const utilisateur: string = this.jwtService.decoded.utilisateur;
                const refresh_orb: string = payload.refresh_token;
                return this.http.post<any>(this.tokenUri + 'refresh', {utilisateur, refresh_token: refresh_orb})
                    .pipe(
                        map(x => {
                            return {message: x.message, data: x.data[0]};
                        }),
                        tap(x => {
                            payload.access_token = x.data.access_token;
                            const succed = this.persistenceManager.set('payload', payload);
                            if (succed) {
                                this.jwtService.setToken(x.data.access_token);
                            }
                        }),
                        map(_ => true),
                        catchError((_) => of(this.router.navigate(['/login'])))
                    );
            }
        }
        return throwError(false);
    }

    private handleError<T>() {
        return (e: any): Observable<T> => {
            let result = e.error as T;
            console.log('ERREURS: ' + (result['errors'] as Array<string>).join(', '));
            return of(result);
        };
    }

}
