import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IGameSettings } from '@app/shared/game-settings';
import { PieceColor } from '@app/shared/piece/piece-color';

@Component({
    selector: 'app-play-options',
    template: `
        <nb-card size="small">
            <nb-card-body class="center-content">
                <div class="grid-container">

                    <p>Difficulty: </p>
                    <nb-select placeholder="Select difficulty" [(selected)]="gameSettings.difficulty">
                        <nb-option *ngFor="let option of difficultyOptions; let i = index" [value]="i">
                            {{ option }}
                        </nb-option>
                    </nb-select>
                    
                    <p>Color: </p>
                    <nb-select placeholder="Select color" [(selected)]="gameSettings.playerColor">
                        <nb-option *ngFor="let option of playerColorOptions; let i = index" [value]="i">
                            {{ option }}
                        </nb-option>
                    </nb-select>
                    
                    <p>Timer: </p>
                    <nb-select placeholder="Select timer" [(selected)]="gameSettings.secondsToThink">
                        <nb-option *ngFor="let option of secondsToThinkOptions" [value]="option">
                            {{ option / 60 }} {{ option == 60 ? "minute" : "minutes"}}
                        </nb-option>
                    </nb-select>
                    
                    <p>Increment: </p>
                    <nb-select placeholder="Select increment" [(selected)]="gameSettings.secondsIncrement">
                        <nb-option *ngFor="let option of secondsIncrementOptions; let i = index" [value]="option">
                            {{ option }} seconds
                        </nb-option>
                    </nb-select>
                </div>
                
                <button nbButton size="giant" status="primary" (click)="submitGameSettings()">Play</button>
            </nb-card-body>
        </nb-card>
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
export class PlayOptionsComponent implements OnInit {

    public readonly difficultyOptions = ['Very easy', 'Easy', 'Medium', 'Hard', 'Very hard'] as const;
    public readonly playerColorOptions = ['White', 'Black'] as const;
    public readonly secondsToThinkOptions = [60, 180, 300, 600, 1800] as const;
    public readonly secondsIncrementOptions = [0, 2, 5, 10, 20] as const;

    public gameSettings: IGameSettings;
    @Output() public startGameEventEmitter = new EventEmitter<IGameSettings>();
    
    public constructor() { }
    
    public ngOnInit(): void {
        this.gameSettings = {
            difficulty: 2,
            playerColor: PieceColor.WHITE,
            secondsToThink: 300,
            secondsIncrement: 0
        };
    }

    public submitGameSettings(): void {
        this.startGameEventEmitter.emit(this.gameSettings);
    }
}
