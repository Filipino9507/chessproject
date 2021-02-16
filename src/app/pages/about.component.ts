import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-about',
    template: `
        <h3>About</h3>
        <p>
            In this app, you can:
        </p>
        <ul>
            <li>set up a game to your liking</li>
            <li>play chess against a friend on the same machine</li>
            <li>save and load games</li>
        </ul>
    `,
    styles: [
    ]
})
export class AboutComponent implements OnInit {

    public constructor() { }
    public ngOnInit(): void { }
}
