import { Component, OnInit } from '@angular/core';
import { IGameResults } from '@app/shared/game-results';
import { IGameSettings } from '@app/shared/game-settings';
import { GameState } from '@app/shared/game-state';

@Component({
    selector: 'app-play-menu',
    template: `
        <div *ngIf="gameState === GameState.PRE_GAME">
            <app-play-options 
                (startGameEventEmitter)="startGame($event)">
            </app-play-options>
        </div>

        <div *ngIf="gameState === GameState.IN_GAME">
            <app-play-board 
                [gameSettings]="gameSettings"
                (endGameEventEmitter)="endGame($event)">
            </app-play-board>
        </div>

        <div *ngIf="gameState === GameState.POST_GAME">
            <app-play-end-game
                [gameResults]="gameResults"
                (resetGameEventEmitter)="resetGame()">
            </app-play-end-game>
        </div>
    `,
    styles: [
        `.grid-container {
            display: grid;
            grid-template-columns: 150px auto;
            padding: 15px;
            text-align: left;
            justify-content: center;
            align-items: center;
        }`
    ]
})
export class PlayComponent implements OnInit {
    
    public GameState = GameState;

    public gameState: GameState;
    public gameSettings: IGameSettings;
    public gameResults: IGameResults;

    public constructor() { }

    public ngOnInit(): void {
        this.gameState = GameState.PRE_GAME;
    }

    public startGame(gameSettings: IGameSettings): void {
        this.gameSettings = gameSettings;
        this.gameState = GameState.IN_GAME;
    }

    public endGame(gameResults: IGameResults): void {
        this.gameResults = gameResults;
        this.gameState = GameState.POST_GAME;
    }

    public resetGame(): void {
        this.gameState = GameState.PRE_GAME;
    }
}
