import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IGameSettings } from '@app/shared/game-settings';
import { PieceColor } from '@app/shared/piece/piece-color';

@Component({
    selector: 'app-play-options',
    templateUrl: './play-options.component.html',
    styleUrls: ['./play-options.component.scss']
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
