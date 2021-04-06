import { Component, OnInit } from '@angular/core';

/** Page, which shows about info */
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

        <p>This Chess app was created as part of the 2021 Maturita exam by Filip Dilmaghani.</p>
    `,
    styles: [
    ]
})
export class AboutComponent implements OnInit {

    public constructor() { }
    public ngOnInit(): void { }
}
