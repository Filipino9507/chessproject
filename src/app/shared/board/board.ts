import { PieceColor } from '@app/shared/piece/piece-color';
import { ITile, ICoordinates, IMove } from '@app/shared/tile';
import { areCoordinatesValid } from '@app/shared/board/board-utility';
import { IBoard } from '@app/shared/board/board-interface';
import { Piece } from '@app/shared/piece/piece';
import { Pawn } from '@app/shared/piece/pawn';
import { Knight } from '@app/shared/piece/knight';
import { Bishop } from '@app/shared/piece/bishop';
import { Rook } from '@app/shared/piece/rook';
import { Queen } from '@app/shared/piece/queen';
import { King } from '@app/shared/piece/king';

/**
 * Class holding the board array, its associated methods and utility methods for
 * working with tiles and coordinates
 */
export class Board implements IBoard {

    /** The dimensions of the board */
    public static readonly BOARD_DIMEN = 8;

    /** The board */
    private _tileArray: ITile[][];

    /** Holds the current move count */
    private _moveCount: number;

    /** Played moves since the beginning of the game */
    private _playedMoves: IMove[];

    /** Constructor */
    constructor() {
        this.reset();
    }

    /** Initializes the _tileArray with the starting pieces */
    private _initializeTileArray(): void {
        this._tileArray = new Array(Board.BOARD_DIMEN);
        for(let rank = 0; rank < Board.BOARD_DIMEN; rank++) {
            this._tileArray[rank] = new Array(Board.BOARD_DIMEN);
            const color = rank > 3 ? PieceColor.WHITE : PieceColor.BLACK;
            for(let file = 0; file < Board.BOARD_DIMEN; file++) {
                let piece: Piece;
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
                this._tileArray[rank][file] = {
                    coords: {file, rank}, 
                    highlighted: false, 
                    piece: piece,
                    threatenedBy: new Set()
                };
                if(piece != null)
                    this._tileArray[rank][file].piece.tile = this._tileArray[rank][file];
            }
        }
    }

    /** Resets baord */
    public reset(): void {
        this._initializeTileArray();
        this.updateThreatMoves();
        this._moveCount = 0;
        this._playedMoves = [];
    }

    /** Takes one move back */
    public takeMoveBack(): void {
        this._playedMoves.pop();
        this.loadGame(this._playedMoves);
    }

    /** Loads game from a string of moves */
    public loadGame(moveList: IMove[]): boolean {
        this.reset();
        for(const { fromCoords, toCoords } of moveList) {
            if(!areCoordinatesValid(fromCoords) || !areCoordinatesValid(toCoords))
                return false;
            const piece = this.getTile(fromCoords).piece;
            if(piece == null)
                return false;
            const mv = piece.move(this, toCoords, true);
            this._playedMoves.push(mv);
            this._moveCount++;
        }
        return true;
    }

    /** Returns the tile specified by the given coordinates */
    public getTile(coords: ICoordinates): ITile {
        return this._tileArray[coords.rank][coords.file];
    }

    /** Clears threat indicators from tiles */
    private clearThreatMoves(): void {
        for(let rank of this._tileArray) {
            for(let tile of rank) {
                tile.threatenedBy.clear();
            }
        }
    }

    /** Updates threat indicators on tiles */
    public updateThreatMoves(): void {
        this.clearThreatMoves();
        for(let rank = 0; rank < Board.BOARD_DIMEN; rank++) {
            for(let file = 0; file < Board.BOARD_DIMEN; file++) {
                const piece = this._tileArray[rank][file].piece;
                if(piece != null)
                   piece.updateBoardThreats(this, {rank, file});
            }
        }
    }

    /** Highlights squares specified by the given coordinates */
    public highlightSquares(coordsArray: ICoordinates[]): void {
        for(const coords of coordsArray) 
            this.getTile(coords).highlighted = true;
    }

    /** Clears all highlighted squares on board */
    public clearHighlightedSquares(): void {
        for(let rank = 0; rank < Board.BOARD_DIMEN; rank++) {
            for(let file = 0; file < Board.BOARD_DIMEN; file++) {
                this._tileArray[rank][file].highlighted = false;
            }
        }
    }

    /** Returns all of the possible moves for the player of the given color */
    public generateAllPossibleMoves(playerColor: PieceColor): IMove[] {
        let fullMoves = [];
        for(let rank = 0; rank < Board.BOARD_DIMEN; rank++) {
            for(let file = 0; file < Board.BOARD_DIMEN; file++) {
                const fromCoords: ICoordinates = {rank, file};
                const piece = this.getTile(fromCoords).piece;
                if(piece != null && piece.color === playerColor) {
                    for(const toCoords of piece.generatePossibleMoves(this, fromCoords)) {
                        fullMoves.push({fromCoords, toCoords});
                    }
                }
            }
        }
        return fullMoves;
    }

    /** Checks whether the tile at the given coordinates is accessible by a king of given color */
    public accessibleByKing(coords: ICoordinates, kingColor: PieceColor): boolean {
        for(let piece of this.getTile(coords).threatenedBy) {
            if(piece.color !== kingColor) 
                return false;
        }
        return true;
    }

    /** Checks if king is safe on this board */
    public isKingSafe(kingColor: PieceColor): boolean {
      let safeKing = true;
      for (let rank = 0; rank < Board.BOARD_DIMEN; rank++) {
          for(let file = 0; file < Board.BOARD_DIMEN; file++) {
              const coords: ICoordinates = {rank, file};
              const maybeKing = this.getTile(coords).piece;
              if(maybeKing != null && maybeKing.checkable &&
                  maybeKing.color === kingColor &&
                  !this.accessibleByKing(coords, kingColor)) {
                      safeKing = false;
                  }      
          }
      }
      return safeKing;
  }

    /** Checks if king is safe after the said move */
    public isKingSafeAfterMove(fromCoords: ICoordinates, toCoords: ICoordinates): boolean {
        const color = this.getTile(fromCoords).piece.color;
        const testBoard = this.copy();
        const movingPiece = testBoard.getTile(fromCoords).piece;
        movingPiece.move(testBoard, toCoords, false);
        testBoard.updateThreatMoves();
        return testBoard.isKingSafe(color);
    }

    /** Returns a deep copy of the board */
    public copy(): Board {
        const prevTileArray = this.tileArray;
        let newBoard = new Board();
        const newTileArray = new Array(Board.BOARD_DIMEN);
        for(let rank = 0; rank < Board.BOARD_DIMEN; rank++) {
            const newRank = new Array(Board.BOARD_DIMEN);
            for(let file = 0; file < Board.BOARD_DIMEN; file++) {        
                const piece = prevTileArray[rank][file].piece;
                const newPiece = piece == null ? null : piece.copy();
                newRank[file] = {
                    coords: {file, rank}, 
                    highlighted: false, 
                    piece: newPiece,
                    threatenedBy: new Set()
                };
                if(piece != null)
                    newRank[file].piece.tile = newRank[file];
            }
            newTileArray[rank] = newRank;
        }
        newBoard.tileArray = newTileArray;
        return newBoard;
    }

    /** Getter for _tileArray */
    public get tileArray(): ITile[][] {
        return this._tileArray;
    }

    /** Setter for _tileArray */
    public set tileArray(value: ITile[][]) {
        this._tileArray = value;
    }

    /** Getter for _moveCount */
    public get moveCount(): number {
        return this._moveCount;
    }

    /** Setter for _moveCount */
    public set moveCount(value: number) {
        this._moveCount = value;
    }

    /** Getter for _playedMoves */
    public get playedMoves(): IMove[] {
        return this._playedMoves;
    }
 }
 