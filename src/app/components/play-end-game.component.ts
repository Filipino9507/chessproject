import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IGameResults } from '@app/shared/game-results';
import { EGameResultReason } from '@app/shared/game-result-reason';
import { PieceColor } from '@app/shared/piece/piece-color';

/** Screen that shows up after the game has finished */
@Component({
    selector: 'app-play-end-game',
    template: `
        <nb-card size="small">
        <nb-card-body class="center-content">        
            <h1>Game results</h1>
            <div [ngSwitch]="gameResults.reason">
                <p *ngSwitchCase="GameResultReason.CHECKMATE">Checkmate</p>
                <p *ngSwitchCase="GameResultReason.TIME_OUT">Won on time</p>
                <p *ngSwitchCase="GameResultReason.RESIGNATION">Resignation</p>
                <p *ngSwitchCase="GameResultReason.STALEMATE">Stalemate</p>
                <p *ngSwitchCase="GameResultReason.REPETITION">Draw by repetition</p>
                <p *ngSwitchCase="GameResultReason.FIFTY_MOVE_RULE">Draw by fifty-move rule</p>
                <p *ngSwitchCase="GameResultReason.AGREEMENT">Draw on agreement</p>
            </div>
            <p *ngIf="gameResults.winner != null">
                Winner: {{ gameResults.winner === PieceColor.WHITE ? 'White': 'Black' }}
            </p>
            <button 
                nbButton 
                size="giant" 
                status="primary"
                (click)="resetGame()">
                Continue
            </button>
        </nb-card-body>
        </nb-card>
    `,
    styles: []
})
export class PlayEndGameComponent implements OnInit {

    /** Reason for the game result (typed as interface GameResultReason) */
    public GameResultReason = EGameResultReason;

    /** Allows usage of PieceColor interface in template */
    public PieceColor = PieceColor;

    /** Game result input (received from play-board-component)  */
    @Input() public gameResults: IGameResults;

    /** Event that resets the game back to options screen */
    @Output() public resetGameEventEmitter = new EventEmitter();

    /** Constructor */
    public constructor() {}

    /** On init */
    public ngOnInit(): void {}

    /** Sends signal to reset the game back to options screen */
    public resetGame(): void {
        this.resetGameEventEmitter.emit();
    }

}
