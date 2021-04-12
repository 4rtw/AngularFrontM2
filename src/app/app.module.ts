import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatMenuModule} from '@angular/material/menu';
import {MatGridListModule} from '@angular/material/grid-list';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {AssignmentsComponent} from './assignments/assignments.component';
import {RenduDirective} from './shared/rendu.directive';
import {NonRenduDirective} from './shared/non-rendu.directive';
import {FormsModule} from '@angular/forms';
import {AssignmentDetailComponent} from './assignments/assignment-detail/assignment-detail.component';
import {AddAssignmentComponent} from './assignments/add-assignment/add-assignment.component';
import {RouterModule, Routes} from '@angular/router';
import {EditAssigmentComponent} from './assignments/edit-assigment/edit-assigment.component';
import {AuthGuard} from './shared/services/auth.guard';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {LoginComponent} from './authentication/login/login.component';
import {RegisterComponent} from './authentication/register/register.component';
import {PeuplerDBDialogComponent} from './dialog-components/peuplerDB-dialog-component/peuplerdb-dialog.component';
import {DeleteConfirmPopupComponent} from './dialog-components/delete-dialog-component/delete-dialog.component';
import {IdleDialogComponent} from './dialog-components/idle-dialog-component/idle-dialog.component';
import {TokenInterceptor} from './shared/interceptors/token.interceptor';
import {UserIdleModule} from 'angular-user-idle';
import {config} from './shared/configs/config';
import {UsersListComponent} from './authentication/users/users-list/users-list.component';
import {UsersDetailsComponent} from './authentication/users/users-details/users-details.component';
import {MatTableModule} from '@angular/material/table';
import {EditUserComponent} from './authentication/users/edit-user/edit-user.component';

const routes: Routes = [
    {
        // indique que http://localhost:4200 sans rien ou avec un "/" à la fin
        // doit afficher le composant AssignmentsComponent (celui qui affiche la liste)
        path: '',
        component: AssignmentsComponent
    },
    {
        // idem avec  http://localhost:4200/home
        path: 'home',
        component: AssignmentsComponent
    },
    {
        path: 'add',
        component: AddAssignmentComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'assignment/:id',
        component: AssignmentDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'assignment/:id/edit',
        component: EditAssigmentComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'users',
        component: UsersListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'users/:id',
        component: UsersDetailsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'users/:id/edit',
        component: EditUserComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    declarations: [
        AppComponent,
        AssignmentsComponent,
        RenduDirective,
        NonRenduDirective,
        AssignmentDetailComponent,
        AddAssignmentComponent,
        EditAssigmentComponent,
        LoginComponent,
        RegisterComponent,
        PeuplerDBDialogComponent,
        IdleDialogComponent,
        DeleteConfirmPopupComponent,
        UsersListComponent,
        UsersDetailsComponent,
        EditUserComponent
    ],
    imports: [
        MatTableModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        MatButtonModule, MatDividerModule, MatIconModule,
        MatFormFieldModule, MatInputModule, MatDatepickerModule,
        MatNativeDateModule, MatListModule, MatCardModule, MatCheckboxModule,
        MatSlideToggleModule,
        MatToolbarModule, MatTooltipModule,
        MatMenuModule,
        MatGridListModule,
        DragDropModule,
        MatDialogModule,
        MatSnackBarModule,
        MatProgressBarModule,
        RouterModule.forRoot(routes), HttpClientModule, ScrollingModule,
        UserIdleModule.forRoot({idle: config.idle, timeout: config.timeout, ping: config.ping})
    ],
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptor,
        multi: true
    }],
    bootstrap: [AppComponent]
})
export class AppModule {
}
