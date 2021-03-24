import { Component, OnInit } from '@angular/core';
import { IGameResults } from '@app/shared/game-results';
import { IGameSettings } from '@app/shared/game-settings';
import { EGameState } from '@app/shared/game-state';
import { StateManager } from '@app/injectables/state-manager';

@Component({
    selector: 'app-play-menu',
    template: `
        <div *ngIf="gameState === EGameState.PRE_GAME">
            <app-play-options 
                (startGameEventEmitter)="startGame($event)">
            </app-play-options>
        </div>

        <div *ngIf="gameState === EGameState.IN_GAME">
            <app-play-board 
                [gameSettings]="gameSettings"
                (endGameEventEmitter)="endGame($event)">
            </app-play-board>
        </div>

        <div *ngIf="gameState === EGameState.POST_GAME">
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
    
    public EGameState = EGameState;

    public gameState: EGameState;
    public gameSettings: IGameSettings;
    public gameResults: IGameResults;

    public constructor(private _stateManager: StateManager) { }

    public ngOnInit(): void {
        const storedGameState = this._stateManager.gameState;
        const storedGameSettings = this._stateManager.gameSettings;
        const storedGameResults = this._stateManager.gameResults;
        if(storedGameSettings)
            this.gameSettings = storedGameSettings;
        if(storedGameResults)
            this.gameResults = storedGameResults;
        this.gameState = storedGameState ? storedGameState : EGameState.PRE_GAME;
    }

    private _setGameState(gameState: EGameState): void {
      this.gameState = gameState;
      this._stateManager.gameState = gameState;
    }

    public startGame(gameSettings: IGameSettings): void {
        this.gameSettings = gameSettings;
        this._stateManager.gameSettings = gameSettings;
        this._setGameState(EGameState.IN_GAME);
    }

    public endGame(gameResults: IGameResults): void {
        this.gameResults = gameResults;
        this._stateManager.gameResults = gameResults;
        this._setGameState(EGameState.POST_GAME);
    }

    public resetGame(): void {
        this._setGameState(EGameState.PRE_GAME);
        this._stateManager.resetGame();
    }
}
