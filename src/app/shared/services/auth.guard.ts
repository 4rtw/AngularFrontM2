import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private jwtService: JwtService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean|UrlTree> | Promise<boolean|UrlTree> | boolean | UrlTree
  {
    if (this.jwtService.getPayload()){
      if (this.jwtService.isTokenExpired()){
        return this.authService.refreshToken();
      }
      else{
        return true;
      }
    }
    else {
      return this.router.navigate(['/login']);
    }
  }
}
