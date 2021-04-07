import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {OnDestroy} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';


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
        private router: Router,
        private snackBar: MatSnackBar
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
                    console.log(response.message);
                    this.snackBar.open('Connexion réussie', 'OK', {
                        duration: 2000
                    });
                }, error => {
                    console.log(error.message);
                    this.snackBar.open('Connexion échouée', 'OK', {
                        duration: 2000, panelClass: ['mat-error']
                    });
                },
                () => {
                    this.router.navigateByUrl('/').then(r => location.reload());
                }
            );
    }

    onSubmit($event: Event): void {
        this.login(this.username, this.password);
    }
}
