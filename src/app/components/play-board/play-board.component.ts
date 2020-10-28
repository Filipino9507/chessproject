import { Component, Input, OnInit } from '@angular/core';
import { IGameSettings, ITileArrayCoordinates, ITileGameCoordinates } from '@app/shared/models';

import { 
  Piece, PieceColor, MoveType,
  Pawn, Knight, Bishop, Rook, Queen, King
} from '@app/shared/piece';

@Component({
  selector: 'app-play-board',
  templateUrl: './play-board.component.html',
  styleUrls: ['./play-board.component.scss']
})
export class PlayBoardComponent implements OnInit {

  Math = Math;  // Enables Math module in template

  public static readonly boardDimen = 8;

  public boardArray: Piece[][];
  public secondsLeft: PieceColor[];
  public activePlayer: PieceColor;

  private selectedTileCoordinates: ITileArrayCoordinates;

  @Input() public gameSettings: IGameSettings;

  public constructor() { }

  public ngOnInit(): void {
    this.activePlayer = PieceColor.WHITE;
    this.selectedTileCoordinates = null;
    this.initializeBoardArray();
    this.initializeTimer();
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

  public initializeTimer(): void {
    this.secondsLeft = new Array(2)
    this.secondsLeft.fill(this.gameSettings.secondsToThink);
    setInterval(_ => {
      --this.secondsLeft[this.activePlayer];
      if(this.secondsLeft[this.activePlayer] <= 0) {
        // EMIT SIGNAL TO END THE GAME
        clearInterval();
      }
    }, 1000);
  }

  public selectTile(x: number, y: number): void {
    const selected = this.boardArray[y][x];
    if(selected != null && selected.color !== this.activePlayer) {
      this.selectedTileCoordinates = {x, y};
    } else if(this.selectedTileCoordinates != null){
      this.makeAMove({x, y});
    }
  }

  public makeAMove(toTile: ITileArrayCoordinates): void {
    const fromTile = this.selectedTileCoordinates;

    if(this.isMoveValid(fromTile, toTile)) {
      this.boardArray[toTile.y][toTile.x] = this.boardArray[fromTile.y][fromTile.x];
      this.boardArray[fromTile.y][fromTile.x] = null;

      this.secondsLeft[this.activePlayer] += this.gameSettings.secondsIncrement;
      this.activePlayer = this.activePlayer === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;
      this.selectedTileCoordinates = null;
    }
  }

  private isMoveValid(fromTile: ITileArrayCoordinates, toTile: ITileArrayCoordinates): boolean {

    const fromPiece = this.boardArray[fromTile.y][fromTile.x];
    const toPiece = this.boardArray[toTile.y][toTile.x];
    
    if(toPiece != null && fromPiece.color === toPiece.color) {
      return false
    }

    const fromTileGame = this.getFromArrayCoordinates(fromTile);
    const toTileGame = this.getFromArrayCoordinates(toTile);

    const dFile = toTileGame.file - fromTileGame.file;
    const dRank = toTileGame.rank - fromTileGame.rank;
    const moveMap = fromPiece.moveMaps[this.activePlayer];
    
    if(dFile > 2 || dRank > 2 || dFile < -2 || dRank < -2) return false;

    if(moveMap[2 + dRank][2 + dFile] === MoveType.MOVE) {
      return true;
    }
    
    return false;
    
  }

  private getFromArrayCoordinates(arrayCoords: ITileArrayCoordinates): ITileGameCoordinates {
    const isWhite = this.gameSettings.playerColor === PieceColor.WHITE;
    return {
      file: isWhite ? arrayCoords.x : 7 - arrayCoords.x, 
      rank: isWhite ? 7 - arrayCoords.y : arrayCoords.y
    };
  }

  private getFromGameCoordinates(gameCoords: ITileGameCoordinates): ITileArrayCoordinates {
    const isWhite = this.gameSettings.playerColor === PieceColor.WHITE;
    return {
      x: isWhite ? gameCoords.file : 7 - gameCoords.file,
      y: isWhite ? 7 - gameCoords.rank : gameCoords.rank
    }
  }
}
