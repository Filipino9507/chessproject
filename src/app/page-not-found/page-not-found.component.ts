import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  template: `
    <h4>This page does not exist.</h4>
    <h4>Click <a routerLink="/home">here</a> to go back to the homepage.</h4>
  `,
  styles: []
})
export class PageNotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
