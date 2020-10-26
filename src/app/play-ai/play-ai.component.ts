import { Component, OnInit } from '@angular/core';

interface GameSettings {
  difficulty: 1 | 2 | 3 | 4 | 5
  playerWhite: boolean
  secondsToThink: number
  secondsIncrement: number
}

@Component({
  selector: 'app-play-menu',
  templateUrl: './play-ai.component.html',
  styleUrls: ['./play-ai.component.scss']
})
export class PlayAIComponent implements OnInit {

  private gameOn: boolean;
  private gameSettings: GameSettings;
  
  public constructor() { }

  public ngOnInit(): void {

  }

  public startGame(): void {

  }
}
