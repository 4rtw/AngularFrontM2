import {AfterViewInit, Component, OnInit} from '@angular/core';
import {UsersService} from '../../../shared/services/users.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Users} from '../../../shared/models/user.model';

@Component({
    selector: 'app-users-list',
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit, AfterViewInit {
    users: Users[] = [];
    page = 1;
    limit = 5;
    totalDocs: number;
    totalPages: number;
    hasPrevPage: boolean;
    prevPage: number;
    hasNextPage: boolean;
    nextPage: number;
    displayedColumns: string[] = ['nom', 'utilisateur', 'estAdmin'];

    constructor(
        private userService: UsersService,
        private route: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe((queryParams) => {
            this.page = +queryParams.page || 1;
            this.limit = +queryParams.limit || 5;
            this.getUsers();
        });
    }

    ngAfterViewInit(): void {
    }

    getUsers(): void {
        this.userService.getUsersPagine(this.page, this.limit)
            .subscribe(
                (data) => {
                    this.users = this.users.concat(data.data);
                    this.limit = data.limit;
                    this.totalDocs = data.totalDocs;
                    this.totalPages = data.totalPages;
                    this.hasPrevPage = data.hasPrevPage;
                    this.prevPage = data.prevPage;
                    this.hasNextPage = data.hasNextPage;
                    this.nextPage = data.nextPage;
                    console.log(data.data);
                });
    }

    getRecord(row: Users): void {
        const id = row.id;
        this.router.navigate(['/users/' + id]);
    }
}
