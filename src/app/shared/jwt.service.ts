import { Injectable } from '@angular/core'
import jwt_decode from "jwt-decode";
import { LocalStorageService } from './local-storage.service'

@Injectable({
    providedIn: 'root',
  })
  export class JwtService {

    jwtToken: string
    decoded: { [key: string]: string}

    constructor(private localStorageService: LocalStorageService) {
        const payload = this.localStorageService.get('payload')
        if(payload) {
            this.jwtToken = payload['access_token']
        }
    }

    setToken(token: string) {
        if(token) {
            this.jwtToken = token
        }
    }

    decodeToken(): void {
        const payload = this.localStorageService.get('payload')
        if(this.jwtToken) {
            this.decoded = jwt_decode<any>(this.jwtToken)
        }
    }

    getPayload() {
        this.decodeToken()
        return this.decoded ? this.decoded : null
    }

    isTokenExpired(): boolean {
        //console.log(this.decodedToken)
        const exp: number = this.decoded? parseInt(this.decoded.exp): null

        if(exp) {
            return ( (exp * 1000 )- Date.now() < 5000 )
        }
        return true
    }

    reset() {
        this.decoded = null
        this.jwtToken = null
    }
  }