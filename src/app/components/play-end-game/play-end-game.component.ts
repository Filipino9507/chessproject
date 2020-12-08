import { Component, OnInit, Input } from '@angular/core';
import { IGameResults, GameResultReason } from '@app/shared/game-results';
import { PieceColor } from '@app/shared/piece/piece-color';

/** Screen that shows up after the game has finished */
@Component({
  selector: 'app-play-end-game',
  templateUrl: './play-end-game.component.html',
  styleUrls: ['./play-end-game.component.scss']
})
export class PlayEndGameComponent implements OnInit {

    /** Reason for the game result (typed as interface GameResultReason) */
    public GameResultReason = GameResultReason;

    /** Allows usage of PieceColor interface in template */
    public PieceColor = PieceColor;

    /** Game result input (received from play-board-component)  */
    @Input() public gameResults: IGameResults;

    /** Constructor */
    public constructor() { }

    /** On init */
    public ngOnInit(): void {
    }

}
