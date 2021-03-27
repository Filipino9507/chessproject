import { Component } from '@angular/core';

/** Page which is shown on a non-existing route */
@Component({
  selector: 'app-page-not-found',
  template: `
    <h4>This page does not exist.</h4>
    <h4>Click <a routerLink="/home">here</a> to go back to the homepage.</h4>
  `,
  styles: []
}) 
export class PageNotFoundComponent { }
