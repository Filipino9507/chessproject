import { Component, NgModule } from '@angular/core';
import { NbMenuComponent, NbMenuItem, NbSidebarService } from '@nebular/theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  readonly title = 'chessproject';

  items: NbMenuItem[] = [
    {
      title: 'Home',
      icon: 'home-outline',
      link: '/home',
      home: true
    },
    {
      title: 'Play',
      icon: 'play-circle-outline',
      children: [
        {
          title: 'Against AI',
          link: '/play-ai',
        },
        {
          title: 'Against another player',
          link: '/play-another'
        },
        {
          title: 'Against a random player',
          link: '/play-random'
        },
      ],
    },
    {
      title: 'Options',
      icon: 'settings-2-outline',
      link: '/options'
    },
    {
      title: 'About',
      icon: 'info-outline',
      link: '/about'
    }
  ];

  constructor(private readonly sidebarService: NbSidebarService) { }

  toggleSidebar(): boolean {
    this.sidebarService.toggle();
    return false;
  }
}

