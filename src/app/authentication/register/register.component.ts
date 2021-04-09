import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UsersService} from '../../shared/services/users.service';
import {Users} from '../../shared/models/user.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    hide = true;
    nom = '';
    username = '';
    password = '';
    userSub: Subscription;

    constructor(
        private router: Router,
        private usersService: UsersService,
        private snackBar: MatSnackBar
    ) {
    }

    ngOnInit(): void {
    }

    onSubmit(event): void {
        if ((!this.username) || (!this.password) || (!this.nom)) {
            return;
        }

        const nouvelUser = new Users();
        nouvelUser.nom = this.nom;
        nouvelUser.motDePasse = this.password;
        nouvelUser.utilisateur = this.username;
        nouvelUser.estAdmin = false;

        this.userSub = this.usersService.addUser(nouvelUser)
            .subscribe(reponse => {
                console.log(reponse.message);
                this.snackBar.open('Utilisateur inscrit avec succès', 'OK', {
                    duration: 2000
                });
                this.router.navigate(['/home']);
            }, error => {
                console.log(error.message);
                this.snackBar.open('Enregistrement de l\' utilisateur échoué', 'OK', {
                    duration: 2000, panelClass: ['mat-error']
                });
            });

        setTimeout(() => {
            this.userSub.unsubscribe();
        }, 10000);
    }
}
