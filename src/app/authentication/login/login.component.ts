import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';


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
                    console.log(response.message[0] + ' ' + response.message[1]);
                    if (response.message[0] === 1) {
                        this.router.navigate(['/home']);
                        let config = new MatSnackBarConfig();
                        config.duration = 1000;
                        this.snackBar.open('Connexion réussie', 'OK', config).afterOpened().subscribe(
                            () => {
                                location.reload();
                            }
                        );
                    } else {
                        let config = new MatSnackBarConfig();
                        config.duration = 1000;
                        this.snackBar.open('Connexion échoué', 'OK', config).afterOpened().subscribe(
                            () => {
                                location.reload();
                            }
                        );
                    }
                },
                error => {
                    console.log(error);
                },
                () => {
                }
            );
    }

    onSubmit($event: Event): void {
        this.login(this.username, this.password);
    }
}
