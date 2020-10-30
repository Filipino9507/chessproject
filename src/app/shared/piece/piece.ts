import { Board } from '@app/shared/board';
import { ITile, ICoordinates } from '@app/shared/tile';
import { PieceColor } from './piece-color';

export abstract class Piece {

    protected _color: PieceColor;
    protected _tile: ITile;
    protected _hasMoved: boolean;

    protected readonly _symbols: string[];
    protected readonly _value: number;

    public constructor(color: PieceColor) {
        this._color = color;
        this._hasMoved = false;
    }

    protected abstract _generateMoves(board: Board, fromCoords: ICoordinates): ICoordinates[];

    public generatePossibleMoves(board: Board, fromCoords: ICoordinates): ICoordinates[] {
        return this._generateMoves(board, fromCoords).filter((coords) => {
            const piece = board.getTile(coords).piece;
            return piece == null || piece.color !== this._color;
        });
    }

    public generateThreatMoves(board: Board, fromCoords: ICoordinates): ICoordinates[] {
        return this._generateMoves(board, fromCoords);
    }       

    public updateBoardThreats(board: Board, fromCoords: ICoordinates): void {
        for(let coords of this.generateThreatMoves(board, fromCoords))
            board.getTile(coords).threatenedBy.add(this);
    }

    protected generateDistanceMoves(
        board: Board, 
        fromCoords: ICoordinates, 
        directions: ICoordinates[]
    ): ICoordinates[] {
        let moves: ICoordinates[] = [];

        for(let direction of directions)
        for(let d = 1; d < Board.BOARD_DIMEN; d++) {
            const toCoords = Board.addCoordinates(fromCoords, Board.scaleCoordinates(direction, d));
            if(Board.contains(toCoords)) {
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

    public get color(): PieceColor {
        return this._color;
    }

    public get hasMoved(): boolean {
        return this._hasMoved;
    }

    public set hasMoved(hasMoved: boolean) {
        this._hasMoved = hasMoved;
    }

    public set tile(tile: ITile) {
        this._tile = tile;
    }

    public get symbol(): string {
        return this._symbols[this._color];
    }

    public get value(): number {
        return this._value;
    }
}
