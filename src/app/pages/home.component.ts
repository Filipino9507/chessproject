import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-home',
    template: `
        <h3>Welcome to Chess!</h3>

        <p>
            A simple chess web application made using the Angular framework made by Google.<br>
            Select what you want to do using the sidebar on the left.
        </p>
    `,
    styles: []
})
export class HomeComponent implements OnInit {
    public constructor() { }
    public ngOnInit(): void { }
}
