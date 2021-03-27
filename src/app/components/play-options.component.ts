import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IGameSettings } from '@app/shared/game-settings';

/** Screen with options for player before game start */
@Component({
    selector: 'app-play-options',
    template: `
        <nb-card size="small">
            <nb-card-header>Game settings</nb-card-header>
            <nb-card-body id="main-container">
                <div id="grid-container">    
                    <p>Timer: </p>
                    <nb-select placeholder="Select timer" [(selected)]="gameSettings.secondsToThink">
                        <nb-option *ngFor="let option of secondsToThinkOptions" [value]="option">
                            {{ option / 60 }} {{ option == 60 ? "minute" : "minutes"}}
                        </nb-option>
                    </nb-select>
                    
                    <p>Increment: </p>
                    <nb-select placeholder="Select increment" [(selected)]="gameSettings.secondsIncrement">
                        <nb-option *ngFor="let option of secondsIncrementOptions" [value]="option">
                            {{ option }} seconds
                        </nb-option>
                    </nb-select>

                    <p>Flip board: </p>
                    <nb-select placeholder="Flip board?" [(selected)]="gameSettings.flipBoard">
                        <nb-option *ngFor="let option of flipBoardOptions" [value]="option">
                            {{ option ? 'Yes' : 'No' }}
                        </nb-option>
                    </nb-select>
                </div>
                <button id="play-button" nbButton size="giant" status="primary" (click)="submitGameSettings()">Play</button>
            </nb-card-body>
        </nb-card>
    `,
    styles: [
        `#main-container {
            display: flex;
            flex-direction: column;
            padding: 10px;
        }
        #grid-container {
            display: grid;
            grid-template-columns: 150px auto;
            text-align: left;
            justify-content: center;
            align-items: center;
            flex: 1;
        }
        #play-button {
            flex: 1;
            margin-top: 3px;
        }`
    ]
})
export class PlayOptionsComponent implements OnInit {
    public readonly secondsToThinkOptions = [60, 180, 300, 600, 1800] as const;
    public readonly secondsIncrementOptions = [0, 2, 5, 10, 20] as const;
    public readonly flipBoardOptions = [true, false] as const;

    public gameSettings: IGameSettings;
    @Output() public startGameEventEmitter = new EventEmitter<IGameSettings>();
    
    public constructor() { }
    
    /** Init */
    public ngOnInit(): void {
        this.gameSettings = {
            secondsToThink: 300,
            secondsIncrement: 0,
            flipBoard: true
        };
    }

    /** Submits game settings to be applied in game */
    public submitGameSettings(): void {
        this.startGameEventEmitter.emit(this.gameSettings);
    }
}
