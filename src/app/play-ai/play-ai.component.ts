import { Component, OnInit } from '@angular/core';

interface GameSettings {
  difficulty?: 0 | 1 | 2 | 3 | 4;
  playerColor: number;
  secondsToThink: number;
  secondsIncrement: number;
}

@Component({
  selector: 'app-play-menu',
  templateUrl: './play-ai.component.html',
  styleUrls: ['./play-ai.component.scss']
})
export class PlayAIComponent implements OnInit {

  public readonly difficultyOptions = ['Very easy', 'Easy', 'Medium', 'Hard', 'Very hard'];
  public readonly playerColorOptions = ['White', 'Black'];
  public readonly secondsToThinkOptions = [60, 180, 300, 600, 1800];
  public readonly secondsIncrementOptions = [0, 2, 5, 10, 20];

  private gameOn: boolean;
  public gameSettings: GameSettings;
  
  public constructor() { }

  public ngOnInit(): void {
    this.gameSettings = {
      difficulty: 2,
      playerColor: 0,
      secondsToThink: 300,
      secondsIncrement: 0
    };
  }

  public startGame(): void {
    console.log(this.gameSettings);
  }
}
