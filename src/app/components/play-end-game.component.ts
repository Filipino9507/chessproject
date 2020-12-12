import { Component, OnInit, Input } from '@angular/core';
import { IGameResults, GameResultReason } from '@app/shared/game-results';
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
                <p *ngSwitchCase="GameResultReason.STALEMATE">Stalemate</p>
                <p *ngSwitchCase="GameResultReason.REPETITION">Draw by repetition</p>
                <p *ngSwitchCase="GameResultReason.FIFTY_MOVE_RULE">Draw by fifty-move rule</p>
            </div>
            <p *ngIf="gameResults.winner != null">
                Winner: {{ gameResults.winner === PieceColor.WHITE ? 'White': 'Black' }}
            </p>
            <button nbButton size="giant" status="primary">Continue</button>
        </nb-card-body>
        </nb-card>
    `,
    styles: []
})
export class PlayEndGameComponent implements OnInit {

    /** Reason for the game result (typed as interface GameResultReason) */
    public GameResultReason = GameResultReason;

    /** Allows usage of PieceColor interface in template */
    public PieceColor = PieceColor;

    /** Game result input (received from play-board-component)  */
    @Input() public gameResults: IGameResults;

    /** Constructor */
    public constructor() {}

    /** On init */
    public ngOnInit(): void {}

}
