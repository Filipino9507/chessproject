import { Component } from '@angular/core';
import { NbMenuItem, NbSidebarService } from '@nebular/theme';

@Component({
    selector: 'app-root',
    template: `
        <nb-layout>
            <nb-layout-header fixed>
                <nb-icon (click)="toggleSidebar()" class="sidebar-toggle" icon="menu-2-outline"></nb-icon>
                <h2>Chess</h2>
            </nb-layout-header>

            <nb-sidebar class="menu-sidebar" responsive start>
                <nb-menu [items]="items"></nb-menu>
            </nb-sidebar>

            <nb-layout-column>
                <router-outlet></router-outlet>
            </nb-layout-column>

            <nb-layout-footer fixed>
                Made by Filip Dilmaghani
            </nb-layout-footer>
        </nb-layout>
    `,
    styles: [
        `.sidebar-toggle {
            padding-right: 1.25rem;
            text-decoration: none;
            color: var(--text-hint-color);
            font-size: 3.5rem;
        }`
    ]
})
export class AppComponent {
    public readonly title = 'chessproject';

    public items: NbMenuItem[] = [
        {
            title: 'Home',
            icon: 'home-outline',
            link: '/home',
            home: true
        },
        {
            title: 'Play',
            icon: 'play-circle-outline',
            link: '/play'
        },
        {
            title: 'About',
            icon: 'info-outline',
            link: '/about'
        }
    ];

    public constructor(private readonly sidebarService: NbSidebarService) {}

    public toggleSidebar(): boolean {
        this.sidebarService.toggle();
        return false;
    }
}

