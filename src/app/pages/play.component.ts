import { Component, OnInit } from '@angular/core';
import { IGameResults } from '@app/shared/game-results';
import { IGameSettings } from '@app/shared/game-settings';
import { GameState } from '@app/shared/game-state';

@Component({
    selector: 'app-play-menu',
    template: `
        <div *ngIf="gameOn === GameState.PRE_GAME">
            <h1>Game settings</h1>
            <p>Please select your game settings.</p>

            <app-play-options 
                (startGameEventEmitter)="startGame($event)">
            </app-play-options>
        </div>

        <div *ngIf="gameOn === GameState.IN_GAME">
            <app-play-board 
                [gameSettings]="gameSettings"
                (endGameEventEmitter)="endGame($event)">
            </app-play-board>
        </div>

        <div *ngIf="gameOn === GameState.POST_GAME">
            <app-play-end-game
                [gameResults]="gameResults">
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
