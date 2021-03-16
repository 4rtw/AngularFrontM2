import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  hide: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit($event: Event): void {

  }
}
