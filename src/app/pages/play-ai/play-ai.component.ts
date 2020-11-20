import { Component, OnInit } from '@angular/core';
import { IGameResults } from '@app/shared/game-results';
import { IGameSettings } from '@app/shared/game-settings';
import { GameState } from '@app/shared/game-state';

@Component({
  selector: 'app-play-menu',
  templateUrl: './play-ai.component.html',
  styleUrls: ['./play-ai.component.scss']
})
export class PlayAIComponent implements OnInit {
    
    public GameState = GameState;

    public gameOn: GameState;
    public gameSettings: IGameSettings;
    public gameResults: IGameResults;

    public constructor() { }

    public ngOnInit(): void {
        this.gameOn = GameState.PRE_GAME;
    }

    public startGame(gameSettings: IGameSettings): void {
        this.gameSettings = gameSettings;
        this.gameOn = GameState.IN_GAME;
    }

    public endGame(gameResults: IGameResults): void {
        this.gameResults = gameResults;
        this.gameOn = GameState.POST_GAME;
    }
}
