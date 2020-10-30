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

    public abstract generateMoves(board: Board, fromCoords: ICoordinates): ICoordinates[];

    public updateBoardPossibleMoves(board: Board, fromCoords: ICoordinates): void {
        for(let coords of this.generateMoves(board, fromCoords))
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

export class Pawn extends Piece {

    protected readonly _symbols = ['♙', '♟'];
    protected readonly _value = 1;

    private generateNormalMoves(board: Board, fromCoords: ICoordinates): ICoordinates[] {
        let moves: ICoordinates[] = [];
        const toCoords = Board.addCoordinates(fromCoords, {file: 0, rank: this.movementDirection()});

        if(Board.contains(toCoords) && board.getTile(toCoords).piece == null)
            moves.push(toCoords);
        return moves;
    }

    private generateFirstRowMoves(board: Board, fromCoords: ICoordinates): ICoordinates[] {
        let moves: ICoordinates[] = [];
        const betweenCoords = Board.addCoordinates(fromCoords, {file: 0, rank: this.movementDirection()});
        const firstRowToCoords = Board.addCoordinates(
            fromCoords, {file: 0, rank: 2 * this.movementDirection()}
        );
        if(Board.contains(firstRowToCoords) && 
        board.getTile(betweenCoords).piece == null && board.getTile(firstRowToCoords).piece == null &&
        (fromCoords.rank === 1 || fromCoords.rank === 6))
            moves.push(firstRowToCoords);
        return moves;
    }

    private generateCaptureMoves(board: Board, fromCoords: ICoordinates): ICoordinates[] {
        let moves: ICoordinates[] = [];
        for(let captureToCoords of [
            Board.addCoordinates(fromCoords, {file: 1, rank: this.movementDirection()}),
            Board.addCoordinates(fromCoords, {file: -1, rank: this.movementDirection()})
        ]) {
            if(Board.contains(captureToCoords) && board.getTile(captureToCoords).piece != null)
                moves.push(captureToCoords);
        }
        return moves;
    }

    public generateMoves(board: Board, fromCoords: ICoordinates): ICoordinates[] {
        return this.generateNormalMoves(board, fromCoords)
        .concat(this.generateFirstRowMoves(board, fromCoords)
        .concat(this.generateCaptureMoves(board, fromCoords)))
    }

    private movementDirection(): 1 | -1 {
        return this._color === PieceColor.WHITE ? -1 : 1;
    }
}

export class Knight extends Piece {

    protected readonly _symbols = ['♘', '♞'];
    protected readonly _value = 3;

    public generateMoves(_: Board, fromCoords: ICoordinates): ICoordinates[] {
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

    public generateMoves(board: Board, fromCoords: ICoordinates): ICoordinates[] {
        return this.generateDistanceMoves(board, fromCoords, [
            {file: 1, rank: 1}, 
            {file: 1, rank: -1},
            {file: -1, rank: 1}, 
            {file: -1, rank: -1}
        ]);
    }
}

export class Rook extends Piece {

    protected readonly _symbols = ['♖', '♜'];
    protected readonly _value = 5;

    public generateMoves(board: Board, fromCoords: ICoordinates): ICoordinates[] {
        return this.generateDistanceMoves(board, fromCoords, [
            {file: 0, rank: 1}, 
            {file: 0, rank: -1},
            {file: -1, rank: 0}, 
            {file: 1, rank: 0}
        ]);
    }
}

export class Queen extends Piece {

    protected readonly _symbols = ['♕', '♛'];
    protected readonly _value = 9;

    public generateMoves(board: Board, fromCoords: ICoordinates): ICoordinates[] {
        return this.generateDistanceMoves(board, fromCoords, [
            {file: 1, rank: 1}, 
            {file: 1, rank: -1},
            {file: -1, rank: 1}, 
            {file: -1, rank: -1},
            {file: 0, rank: 1}, 
            {file: 0, rank: -1},
            {file: -1, rank: 0}, 
            {file: 1, rank: 0}
        ]);
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

    public generateMoves(board: Board, fromCoords: ICoordinates): ICoordinates[] {
        let moves: ICoordinates[] = [];

        for(let dRank = -1; dRank <= 1; dRank++) {
            for(let dFile = -1; dFile <= 1; dFile++) {
                if(dRank === 0 && dFile === 0) continue;

                const toCoords = Board.addCoordinates(fromCoords, {file: dFile, rank: dRank});
                if(Board.contains(toCoords) /* && !this.isThreatened(board, fromCoords) */)
                    moves.push(toCoords);

                // EVENTUALLY NEED TO SOLVE {BIG PROBLEMS} WITH:
                // - pawns count their normal moves as threatening the squares
                // - kings do not count the squares next to kings - since they cannot go there,
                // but therefore do not prevent the other king from going there
                
                // POSSIBLE FIX:
                // - king moves to the space in the background, then the board updates moves
                // - the new king's spot is now checked for 
                // HOWEVER, A RECURSION OCCURS
            }
        }

        return moves;
    }
}

