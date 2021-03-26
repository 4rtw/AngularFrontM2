import { Component, OnInit } from '@angular/core'
import {Router} from '@angular/router'
import {UsersService} from '../../shared/users.service'
import {Users} from '../user.model'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  hide = true
  nom = ''
  username = ''
  password = ''

  constructor(
      private router: Router,
      private usersService: UsersService
  ) { }

  ngOnInit(): void {
  }

  onSubmit(event): void {
    if ((!this.username) || (!this.password) || (!this.nom)){return }

    const nouvelUser = new Users()
    nouvelUser.nom = this.nom
    nouvelUser.motDePasse = this.password
    nouvelUser.utilisateur = this.username
    nouvelUser.isAdmin = false

    this.usersService.addUser(nouvelUser)
        .subscribe( reponse => {
          console.log(reponse.message)
        })
  }
}
