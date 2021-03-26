import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JwtService } from "./jwt.service";

@Injectable({
    providedIn: 'root',
  })
export class TokenInterceptor implements HttpInterceptor {
 
  constructor( private jwtService: JwtService) { }
 
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.jwtService.jwtToken;
    req = req.clone({
      url:  req.url,
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next.handle(req);
  }
}