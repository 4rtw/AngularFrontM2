import {Component, OnInit} from '@angular/core';
import {Users} from '../../../shared/models/user.model';
import {ActivatedRoute, Router} from '@angular/router';
import {UsersService} from '../../../shared/services/users.service';

@Component({
    selector: 'app-edit-user',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
    user: Users;
    // pour le formulaire
    realName = '';
    username: string;
    confirmPassword = '';
    password: '';
    hide = true;
    isAdmin = false;

    constructor(
        private userService: UsersService,
        private route: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.getUserByID();
    }

    getUserByID(): void {
        const id: number = +this.route.snapshot.params.id;

        console.log('Dans ngOnInit de details, id = ' + id);

        this.userService.getUser(id).subscribe((user) => {
                console.log(user[0] + 'Je suis dans la riviere');
                this.user = user[0];
                this.realName = this.user.nom;
                this.username = this.user.utilisateur;
                this.isAdmin = this.user.estAdmin;
            }
        );
    }

    onSubmit($event: Event): void {
        if ((!this.realName) || (!this.username)) {
            return;
        }

        this.user.nom = this.realName;
        this.user.utilisateur = this.username;
        this.user.estAdmin = this.isAdmin;

        if (this.password === this.confirmPassword) {
            this.user.motDePasse = this.password;
        } else {
            return;
        }

        this.userService.updateUser(this.user).subscribe(
            (message) => {
                console.log(message.message);
                this.router.navigate(['/users']);
            });
    }

    onChange(): void {
        this.isAdmin = !this.isAdmin;
    }
}
