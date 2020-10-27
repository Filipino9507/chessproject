import { Component, Input, OnInit } from '@angular/core';
import { IGameSettings } from '@app/shared/models';

import { 
  Piece,
  PieceColor,
  Pawn,
  Knight,
  Bishop,
  Rook,
  Queen,
  King
} from '@app/shared/piece';

@Component({
  selector: 'app-play-board',
  templateUrl: './play-board.component.html',
  styleUrls: ['./play-board.component.scss']
})
export class PlayBoardComponent implements OnInit {

  public static readonly boardDimen = 8;

  public boardArray: Piece[][];
  @Input() public gameSettings: IGameSettings;

  public constructor() { }

  public ngOnInit(): void {
    this.initializeBoardArray();
  }

  private initializeBoardArray(): void {
    this.boardArray = new Array(PlayBoardComponent.boardDimen);

    for(let i = 0; i < PlayBoardComponent.boardDimen; i++) {
      this.boardArray[i] = new Array(PlayBoardComponent.boardDimen);

      const color = (this.gameSettings.playerColor === PieceColor.WHITE ? i > 3 : i <= 3) 
      ? PieceColor.WHITE : PieceColor.BLACK;

      if(i === 0 || i === 7) {
        this.boardArray[i][0] = this.boardArray[i][7] = new Rook(color);
        this.boardArray[i][1] = this.boardArray[i][6] = new Knight(color);
        this.boardArray[i][2] = this.boardArray[i][5] = new Bishop(color);
        this.boardArray[i][3] = new Queen(color);
        this.boardArray[i][4] = new King(color);
      } else if(i === 1 || i === 6) {
        this.boardArray[i].fill(new Pawn(color));
      } else {
        this.boardArray[i].fill(null);
      }
    }
  }

}
