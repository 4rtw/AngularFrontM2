import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, of, throwError } from 'rxjs'
import {catchError, map, tap} from 'rxjs/operators'
import { JwtService } from './jwt.service'
import { LocalStorageService } from './local-storage.service'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  //uri = 'https://backend-nodejs-m2-n-a.herokuapp.com/api/authentifications/'
  uri = 'http://localhost:8010/api/authentifications/'
  tokenUri = 'http://localhost:8010/api/token/'

  constructor(private http: HttpClient, private persistenceManager: LocalStorageService, private jwtService: JwtService, private router: Router) {}

  logIn(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.uri + 'login', {utilisateur: username, motDePasse: password})
      .pipe(
          map( x => {
            return {message: x['message'], data: x['data'][0]}
          }),
          tap(x => {
            let succed = this.persistenceManager.set('payload', x.data)
            if(succed) {
                this.jwtService.setToken(x.data['access_token'])
            }
          }),
          catchError(this.handleError<any>())
      )
  }

  logOut(): Observable<any> {
    return this.http.post<any>(this.uri + "logout", {na:"n/a"})
      .pipe(
        map( x => {
          return {message: x['message']}
        }),
        tap(x => {
          let succed = this.persistenceManager.remove('payload')
          if(succed) {
            this.jwtService.reset()
          }
        }),
        catchError(this.handleError<any>())
      )
  }
  
  refreshToken(): Observable<any> {
    if(this.jwtService.isTokenExpired && this.jwtService.jwtToken) {
      const payload = this.persistenceManager.get('payload') 
      if(payload) {
        const utilisateur: string = this.jwtService.decoded['utilisateur']
        const refresh_orb: string = payload['refresh_token']
        return this.http.post<any>(this.tokenUri + 'refresh', {utilisateur: utilisateur, refresh_token: refresh_orb})
          .pipe(
            map( x => {
              return {message: x['message'], data: x['data'][0]}
            }),
            tap(x => {
              payload['access_token'] = x.data['access_token']
              let succed = this.persistenceManager.set('payload', payload)
              if(succed) {
                  this.jwtService.setToken(x.data['access_token'])
              }
            }),
            map(_ => true),
            catchError((_) => of(this.router.navigate(['/login'])))
          )
      }
    }
    return throwError(false)
  }

  private handleError<T>() {
    return (e: any): Observable<T> => {
      let result = e.error as T
      console.log('ERREURS: ' + (result['errors'] as Array<string>).join(', '))
      return of(result)
    }
  }

}
