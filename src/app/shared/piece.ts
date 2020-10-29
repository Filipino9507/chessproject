import { ITile, ICoordinates, Board } from '@app/shared/board';

export enum PieceColor {
    WHITE = 0,
    BLACK = 1
}

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

    public get color(): PieceColor {
        return this._color;
    }

    public get hasMoved(): boolean {
        return this._hasMoved;
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

    public updateBoardPossibleMoves(board: Board, fromCoords: ICoordinates): void {
        for(let coord of this.generatePossibleMoves(board, fromCoords)) {
            board.getTile(coord).threatenedBy.add(this);
        }
    }

    public abstract generatePossibleMoves(board: Board, fromCoords: ICoordinates): ICoordinates[];
}

export class Pawn extends Piece {

    protected readonly _symbols = ['♙', '♟'];
    protected readonly _value = 1;

    public generatePossibleMoves(board: Board, fromCoords: ICoordinates): ICoordinates[] {
        let moves: ICoordinates[] = [];

        // Normal move
        const toCoords = Board.addCoordinates(fromCoords, {file: 0, rank: this.movementDirection()});
        if(Board.contains(toCoords) && board.getTile(toCoords).piece == null)
            moves.push(toCoords);

        // Move on first row
        const firstRowToCoords = Board.addCoordinates(
            fromCoords, {file: 0, rank: 2 * this.movementDirection()}
        );
        if(Board.contains(firstRowToCoords) && 
        board.getTile(toCoords).piece == null && board.getTile(firstRowToCoords).piece == null &&
        (fromCoords.rank === 1 || fromCoords.rank === 6))
            moves.push(firstRowToCoords);
        
        // Capture only move
        for(let captureToCoords of [
            Board.addCoordinates(fromCoords, {file: 1, rank: this.movementDirection()}),
            Board.addCoordinates(fromCoords, {file: -1, rank: this.movementDirection()})
        ]) {
            if(Board.contains(captureToCoords) && board.getTile(captureToCoords).piece != null)
                moves.push(captureToCoords);
        }
        return moves;
    }

    private movementDirection(): 1 | -1 {
        return this._color === PieceColor.WHITE ? -1 : 1;
    }
}

export class Knight extends Piece {

    protected readonly _symbols = ['♘', '♞'];
    protected readonly _value = 3;

    public generatePossibleMoves(_: Board, fromCoords: ICoordinates): ICoordinates[] {
        let moves: ICoordinates[] = [];

        for(let toCoords of [
            Board.addCoordinates(fromCoords, {file: -1, rank: 2}),
            Board.addCoordinates(fromCoords, {file: 1, rank: 2}),
            Board.addCoordinates(fromCoords, {file: -1, rank: -2}),
            Board.addCoordinates(fromCoords, {file: 1, rank: -2}),
            Board.addCoordinates(fromCoords, {file: 2, rank: -1}),
            Board.addCoordinates(fromCoords, {file: 2, rank: 1}),
            Board.addCoordinates(fromCoords, {file: -2, rank: -1}),
            Board.addCoordinates(fromCoords, {file: -2, rank: 1}),
        ]) {
            if(Board.contains(toCoords)) moves.push(toCoords);
        }
        return moves;
    }
}

export class Bishop extends Piece {

    protected readonly _symbols = ['♗', '♝'];
    protected readonly _value = 3;

    public generatePossibleMoves(board: Board, fromCoords: ICoordinates): ICoordinates[] {
        return [];
    }
}

export class Rook extends Piece {

    protected readonly _symbols = ['♖', '♜'];
    protected readonly _value = 5;

    public generatePossibleMoves(board: Board, fromCoords: ICoordinates): ICoordinates[] {
        return [];
    }
}

export class Queen extends Piece {

    protected readonly _symbols = ['♕', '♛'];
    protected readonly _value = 9;

    public generatePossibleMoves(board: Board, fromCoords: ICoordinates): ICoordinates[] {
        return [];
    }
}

export class King extends Piece {

    protected readonly _symbols = ['♔', '♚'];
    protected readonly _value = Infinity;

    public isThreatened(board: Board, toCoords: ICoordinates): boolean {
        for(let piece of board.getTile(toCoords).threatenedBy) {
            if(piece.color !== this._color) 
                return true;
        }
        return false;
    }

    public generatePossibleMoves(board: Board, fromCoords: ICoordinates): ICoordinates[] {
        let moves: ICoordinates[] = [];

        for(let dRank = -1; dRank <= 1; dRank++) {
            for(let dFile = -1; dFile <= 1; dFile++) {
                if(dRank === 0 && dFile === 0) continue;

                const toCoords = Board.addCoordinates(fromCoords, {file: dFile, rank: dRank});
                if(Board.contains(toCoords) && !this.isThreatened(board, toCoords))
                    moves.push(toCoords);

                // EVENTUALLY NEED TO SOLVE {BIG PROBLEMS} WITH:
                // - pawns count their normal moves as threatening the squares
                // - kings do not count the squares next to kings - since they cannot go there,
                // but therefore do not prevent the other king from going there

                // POSSIBLE FIX:
                // - two separate sets (threatenedBy) on each spot - one for 'pacifist' moves and
                // one for moves/captures
                // - e.g. pawn moving forward or castling is a 'pacifist' move 
            }
        }

        return moves;
    }
}

