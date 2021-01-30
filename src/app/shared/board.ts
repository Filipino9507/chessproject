import { PieceColor } from '@app/shared/piece/piece-color';
import { ITile, ICoordinates } from '@app/shared/tile';
import { 
    generateBoardAfterMove, 
    isKingSafeOnBoard,
    areCoordinatesValid
} from '@app/shared/board-utility';
import { IBoard } from '@app/shared/board-interface';
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

    /** Constructor */
    constructor() {
        this._initializeTileArray();
        this.updateThreatMoves();
        this._moveCount = 0;

        // this.loadGame('6444')
    }

    /** Loads game from a string of moves */
    public loadGame(moveList: {fromCoords: ICoordinates, toCoords: ICoordinates}[]): boolean {
        console.log('BBBB');
        this._initializeTileArray();
        this.updateThreatMoves();
        this._moveCount = 0;
        for(const {fromCoords, toCoords} of moveList) {
            if(!areCoordinatesValid(fromCoords) || !areCoordinatesValid(toCoords))
                return false;
            const piece = this.getTile(fromCoords).piece;
            if(piece == null)
                return false;
            piece.move(this, toCoords);
            this._moveCount++;
        }
        return true;
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
                let piece: Piece;
                const tile = this._tileArray[rank][file];
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

    /** Returns all of the possible moves for the player of the given color */
    public generateAllPossibleMoves(playerColor: PieceColor): {fromCoords: ICoordinates, toCoords: ICoordinates}[] {
        let fullMoves: {fromCoords: ICoordinates, toCoords: ICoordinates}[] = [];
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

    /** Checks if king is safe after the said move */
    public isKingSafeAfterMove(fromCoords: ICoordinates, toCoords: ICoordinates): boolean {
        const color = this.getTile(fromCoords).piece.color;
        const testBoard = generateBoardAfterMove(this, fromCoords, toCoords);
        return isKingSafeOnBoard(testBoard, color);
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
 }
 