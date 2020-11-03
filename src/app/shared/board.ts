import { PieceColor } from '@app/shared/piece/piece-color';
import { ITile, ICoordinates } from '@app/shared/tile';
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
export class Board {

    /** The dimensions of the board */
    public static readonly BOARD_DIMEN = 8;

    /** The board */
    private _tileArray: ITile[][];

    private _moveCount: number;

    /** Constructor */
    constructor() {
        this._initializeTileArray();
        this.updateThreatMoves();
        this._moveCount = 0;
    }

    /** Returns the tile specified by the given coordinates */
    public getTile(coords: ICoordinates): ITile {
        return this._tileArray[coords.rank][coords.file];
    }

    /** Initializes the _tileArray with the starting pieces */
    private _initializeTileArray(): void {
        this._tileArray = new Array(Board.BOARD_DIMEN);

        for(let rank = 0; rank < Board.BOARD_DIMEN; rank++) {
            this._tileArray[rank] = new Array(Board.BOARD_DIMEN);

            const color = rank > 3 ? PieceColor.WHITE : PieceColor.BLACK;

            for(let file = 0; file < Board.BOARD_DIMEN; file++) {
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

    /** Checks whether the tile at the given coordinates is accessible by a king of given color */
    public accessibleByKing(coords: ICoordinates, kingColor: PieceColor): boolean {
        for(let piece of this.getTile(coords).threatenedBy) {
            if(piece.color !== kingColor) 
                return false;
        }
        return true;
    }

    /** Getter for _tileArray */
    public get tileArray(): ITile[][] {
        return this._tileArray;
    }

    /** Getter for _moveCount */
    public get moveCount(): number {
        return this._moveCount;
    }

    /** Setter for _moveCount */
    public set moveCount(value: number) {
        this._moveCount = value;
    } 

    // #region STATIC

    /** Check whether the given coordinates exist within the board */
    public static contains(coords: ICoordinates): boolean {
        return coords.rank >= 0 && coords.rank < Board.BOARD_DIMEN && 
        coords.file >= 0 && coords.file < Board.BOARD_DIMEN;
    }

    /** Returns whether two coordinates are equal */
    public static areCoordinatesEqual(coords1: ICoordinates, coords2: ICoordinates): boolean {
        return coords1.rank === coords2.rank && coords1.file === coords2.file;
    }

    /** Returns two coordinates added together */
    public static addCoordinates(coords1: ICoordinates, coords2: ICoordinates): ICoordinates {
        return {file: coords1.file + coords2.file, rank: coords1.rank + coords2.rank};
    }

    /** Returns coordinates object multiplied by a scalar value */
    public static scaleCoordinates(coords: ICoordinates, scale: number): ICoordinates {
        return {file: scale * coords.file, rank: scale * coords.rank};
    }

    /** Checks whether an array contains given coordinates */
    public static areCoordinatesInArray(coords: ICoordinates, array: ICoordinates[]): boolean {
        for(let elt of array)
            if(Board.areCoordinatesEqual(elt, coords)) 
                return true;
        return false;
    }

    // #endregion

 }