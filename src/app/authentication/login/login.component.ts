import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {Router} from '@angular/router';
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements  OnInit, OnDestroy{
  hide = true;
  login_sub: Subscription;

  constructor(private authService: AuthService,private router: Router) { }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.login_sub?.unsubscribe()
  }

  onRegisterClick(): void {
    this.router.navigate(['/register']);
    console.log('register here redirected');
  }

  login(): void {
    this.login_sub = this.authService.logIn("paul", "goavymanta").subscribe(_=>{ this.router.navigate(['/']) }, console.error)
  }

  onSubmit($event: Event) {

  }
}
