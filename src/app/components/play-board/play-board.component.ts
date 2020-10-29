import { Component, Input, OnInit } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { IGameSettings, ITileArrayCoordinates, ITileGameCoordinates } from '@app/shared/models';

import { Piece, PieceColor,
Pawn, Knight, Bishop, Rook, Queen, King } from '@app/shared/piece';
import { ITile } from '@app/shared/tile';

@Component({
  selector: 'app-play-board',
  templateUrl: './play-board.component.html',
  styleUrls: ['./play-board.component.scss']
})
export class PlayBoardComponent implements OnInit {

  Math = Math;  // Enables Math module in template

  public static readonly boardDimen = 8;

  public boardArray: ITile[][];
  public secondsLeft: PieceColor[];
  public activePlayerColor: PieceColor;

  private selectedTileCoordinates: ITileArrayCoordinates;

  @Input() public gameSettings: IGameSettings;

  public constructor() { }

  public ngOnInit(): void {
    this.activePlayerColor = PieceColor.WHITE;
    this.selectedTileCoordinates = null;
    this.initializeBoardArray();
    this.initializeTimer();
  }

  private initializeBoardArray(): void {
    this.boardArray = new Array(PlayBoardComponent.boardDimen);

    for(let rank = 0; rank < PlayBoardComponent.boardDimen; rank++) {
      this.boardArray[rank] = new Array(PlayBoardComponent.boardDimen);

      const color = (this.gameSettings.playerColor === PieceColor.WHITE ? rank > 3 : rank <= 3) 
      ? PieceColor.WHITE : PieceColor.BLACK;

      for(let file = 0; file < PlayBoardComponent.boardDimen; file++) {
        let piece;
        switch(rank) {
          case 0: case 7:
            switch(file) {
              case 3: piece = new Queen(color); break;
              case 4: piece = new King(color); break;
              case 0: case 7: piece = new Rook(color); break;
              case 1: case 6: piece = new Knight(color); break;
              default: piece = new Bishop(color); break;
            } 
            break;
          case 1: case 6: piece = new Pawn(color); break;
          default: piece = null;
        }

        this.boardArray[rank][file] = {
          file: rank, 
          rank: file, 
          highlighted: false, 
          piece: piece
        };
      }
    }
  }

  public initializeTimer(): void {
    this.secondsLeft = new Array(2)
    this.secondsLeft.fill(this.gameSettings.secondsToThink);
    setInterval(_ => {
      --this.secondsLeft[this.activePlayerColor];
      if(this.secondsLeft[this.activePlayerColor] <= 0) {
        // EMIT SIGNAL TO END THE GAME
        clearInterval();
      }
    }, 1000);
  }

  public selectTile(x: number, y: number): void {
    
  }

}
