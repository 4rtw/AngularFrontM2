import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
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
                    console.log(response.message[0] + ' ' + response.message[1]);
                    if (response.message[0] === 1) {
                        this.router.navigate(['/home']);
                        this.snackBar.open('Connexion réussie', 'OK');
                        setTimeout(() => location.reload(), 1500);
                    } else {
                        this.snackBar.open('Connexion échoué', 'OK');
                        setTimeout(() => location.reload(), 1500);
                    }
                },
                error => {
                    console.log(error + 'Je suis la');
                },
                () => {
                    // setTimeout(() => location.reload(), 1000);
                    // this.router.navigate(['/home']);
                }
            );
    }

    onSubmit($event: Event): void {
        this.login(this.username, this.password);
    }
}
