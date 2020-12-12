import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-home',
    template: `
        <h3>Welcome to Chess Press!</h3>

        <p>
            A simple chess web application made in Angular <br />
            Here, you can do the following things:
        </p>

        <ul>
            <li>play chess against an AI</li>
            <li>play chess against another person</li>
            <li>play chess against a random person</li>
        </ul>

        <p>Select what you want to do using the sidebar on the left.</p>
    `,
    styles: []
})
export class HomeComponent implements OnInit {
    constructor() {}
    ngOnInit(): void {}
}
