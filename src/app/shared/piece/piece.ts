import { IBoard } from '@app/shared/board/board-interface';
import { BOARD_DIMEN, addCoordinates, scaleCoordinates, areCoordinatesValid } from '@app/shared/board/board-utility';
import { ITile, ICoordinates, IMove, ECastling } from '@app/shared/tile';
import { PieceColor } from '@app/shared/piece/piece-color';

export abstract class Piece {
    
    /** Color of the piece */
    protected _color: PieceColor;

    /** Tile which the piece  */
    protected _tile: ITile;

    /** Stores if the piece has moved */
    protected _hasMoved: boolean;

    /** Stores symbols for the piece */
    protected readonly _symbols: string[];

    /** Stores if the piece can be checked */
    protected readonly _checkable: boolean;

    /** Constructor */
    public constructor(color: PieceColor) {
        this._color = color;
        this._hasMoved = false;
    }

    /** Abstract copy method */
    public abstract copy(): Piece;

    /** Abstract method which generates all moves, even those that put the king in danger */
    protected abstract _generateMoves(board: IBoard, fromCoords: ICoordinates): ICoordinates[];

    /** Class that generates moves and determines which are actually possible with regards to king safety and other pieces */
    public generatePossibleMoves(board: IBoard, fromCoords: ICoordinates): ICoordinates[] {
        return this._generateMoves(board, fromCoords).filter((toCoords) => {
            const piece = board.getTile(toCoords).piece;
            return (piece == null || piece.color !== this._color)
                && board.isKingSafeAfterMove(fromCoords, toCoords);
        });
    }

    /** Generates moves that threaten squares (the same as generate moves by default) */
    public generateThreatMoves(board: IBoard, fromCoords: ICoordinates): ICoordinates[] {
        return this._generateMoves(board, fromCoords);
    }       

    /** Updates bpard threats by this piece */
    public updateBoardThreats(board: IBoard, fromCoords: ICoordinates): void {
        for(let coords of this.generateThreatMoves(board, fromCoords))
            board.getTile(coords).threatenedBy.add(this);
    }

    /** Utility method to generate distance moves (for queen, bishop and rook) */
    protected _generateDistanceMoves(
        board: IBoard, 
        fromCoords: ICoordinates, 
        directions: ICoordinates[]
    ): ICoordinates[] {
        let moves: ICoordinates[] = [];
        for(let direction of directions)
        for(let d = 1; d < BOARD_DIMEN; d++) {
            const toCoords = addCoordinates(fromCoords, scaleCoordinates(direction, d));
            if(areCoordinatesValid(toCoords)) {
                const piece = board.getTile(toCoords).piece;
                if(piece == null) {
                    moves.push(toCoords);
                } else {
                    if(piece.color !== this._color) 
                        moves.push(toCoords);
                    break;
                }
            }      
        }
        return moves;
    }

    /** General move method, which takes a board and moves this piece */
    public move(board: IBoard, toCoords: ICoordinates): IMove {
        const fromTile = this._tile;
        const toTile = board.getTile(toCoords);
        const capture = toTile.piece != null;
        toTile.piece = fromTile.piece;
        fromTile.piece = null;
        this._tile = toTile;
        this._hasMoved = true;
        return {
            fromCoords: fromTile.coords,
            toCoords,
            pieceSymbol: this.symbol,
            capture,
            castling: ECastling.NONE
        };
    }

    /** GETTERS AND SETTERS */
    
    public get color(): PieceColor {
        return this._color;
    }

    public get hasMoved(): boolean {
        return this._hasMoved;
    }

    public set hasMoved(value: boolean) {
        this._hasMoved = value;
    }

    public set tile(value: ITile) {
        this._tile = value;
    }

    public get symbol(): string {
        return this._symbols[this._color];
    }

    public get checkable(): boolean {
        return this._checkable;
    }
}
