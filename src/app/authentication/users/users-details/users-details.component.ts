import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Users} from '../../../shared/models/user.model';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {UsersService} from '../../../shared/services/users.service';

@Component({
  selector: 'app-users-details',
  templateUrl: './users-details.component.html',
  styleUrls: ['./users-details.component.css']
})
export class UsersDetailsComponent implements OnInit, AfterViewInit {
  theUser: Users;

  constructor(
      private userService: UsersService,
      private route: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    const id: number = +this.route.snapshot.params.id;

    console.log('Dans ngOnInit de details, id = ' + id);
    this.userService.getUser(id).subscribe((user) => {
      this.theUser = user[0];
    });
  }

  ngAfterViewInit(): void {
  }

  onClickEdit(): void {
    const id = +this.route.snapshot.params.id;
    this.router.navigate(['/users/' + id + '/edit']);
  }

  onClickDelete(): void {
    const id = +this.route.snapshot.params.id;
    this.userService.deleteUser(this.theUser).subscribe(
        result => {
          this.router.navigate(['/users']).then(
              _ => {
                location.reload();
              }
          );
          console.log(result.message);
        }
    );
  }
}
