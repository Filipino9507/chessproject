import { Component, OnInit, Input } from '@angular/core';
import { IGameResults, GameResultReason } from '@app/shared/game-results';
import { PieceColor } from '@app/shared/piece/piece-color';

@Component({
  selector: 'app-play-end-game',
  templateUrl: './play-end-game.component.html',
  styleUrls: ['./play-end-game.component.scss']
})
export class PlayEndGameComponent implements OnInit {

    public GameResultReason = GameResultReason;
    public PieceColor = PieceColor;

    @Input() public gameResults: IGameResults;

    public constructor() { }

    public ngOnInit(): void {
    }

}
