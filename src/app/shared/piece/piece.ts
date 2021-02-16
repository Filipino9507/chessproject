import { IBoard } from '@app/shared/board-interface';
import { BOARD_DIMEN, addCoordinates, scaleCoordinates, areCoordinatesValid } from '@app/shared/board-utility';
import { ITile, ICoordinates, IMove, ECastling } from '@app/shared/tile';
import { PieceColor } from '@app/shared/piece/piece-color';

export abstract class Piece {
    
    protected _color: PieceColor;
    protected _tile: ITile;
    protected _hasMoved: boolean;

    protected readonly _symbols: string[];
    protected readonly _value: number;
    protected readonly _checkable: boolean;

    public constructor(color: PieceColor) {
        this._color = color;
        this._hasMoved = false;
    }

    public abstract copy(): Piece;

    protected abstract _generateMoves(board: IBoard, fromCoords: ICoordinates): ICoordinates[];

    public generatePossibleMoves(board: IBoard, fromCoords: ICoordinates): ICoordinates[] {
        return this._generateMoves(board, fromCoords).filter((toCoords) => {
            const piece = board.getTile(toCoords).piece;
            return (piece == null || piece.color !== this._color)
                && board.isKingSafeAfterMove(fromCoords, toCoords);
        });
    }

    public generateThreatMoves(board: IBoard, fromCoords: ICoordinates): ICoordinates[] {
        return this._generateMoves(board, fromCoords);
    }       

    public updateBoardThreats(board: IBoard, fromCoords: ICoordinates): void {
        for(let coords of this.generateThreatMoves(board, fromCoords))
            board.getTile(coords).threatenedBy.add(this);
    }

    protected generateDistanceMoves(
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

    public get value(): number {
        return this._value;
    }

    public get checkable(): boolean {
        return this._checkable;
    }
}
