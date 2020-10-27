import { Component, OnInit } from '@angular/core';
import { IGameSettings } from '@app/shared/models';

@Component({
  selector: 'app-play-menu',
  templateUrl: './play-ai.component.html',
  styleUrls: ['./play-ai.component.scss']
})
export class PlayAIComponent implements OnInit {

  public gameOn: boolean;
  public gameSettings: IGameSettings;
  
  public constructor() { }

  public ngOnInit(): void {
    this.gameOn = false;
  }

  public startGame(gameSettings: IGameSettings) {
    this.gameSettings = gameSettings;
    this.gameOn = true;
    console.log(this.gameSettings)
  }
}
