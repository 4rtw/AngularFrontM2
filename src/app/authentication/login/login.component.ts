import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
    hide = true;
    login_sub: Subscription;
    username: string;
    password: string;

    constructor(
        private authService: AuthService,
        private router: Router
    ) {
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.login_sub?.unsubscribe();
    }

    onRegisterClick(): void {
        this.router.navigate(['/register']);
        console.log('register here redirected');
    }

    login(user, pass): void {
        this.login_sub = this.authService
            .logIn(user, pass)
            .subscribe(response => {
                    console.log(response);
                },
                error => {
                    console.log(error);
                },
                () => {
                    setTimeout(() => location.reload(), 1000);
                    this.router.navigate(['/home']);
                }
            );
    }

    onSubmit($event: Event): void {
        this.login(this.username, this.password);
    }
}
