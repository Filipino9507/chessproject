import { IBoard } from '@app/shared/board/board-interface';
import { addCoordinates, areCoordinatesValid } from '@app/shared/board/board-utility';
import { ICoordinates, IMove } from '@app/shared/tile';
import { Piece } from '@app/shared/piece/piece';
import { PieceColor } from '@app/shared/piece/piece-color'; 
import { Queen } from '@app/shared/piece/queen';

export class Pawn extends Piece {

    protected readonly _symbols = ['♙', '♟'];
    protected readonly _value = 1;
    protected readonly _checkable = false
    protected _firstRowMoveNumber = 0;

    /** Override */
    public copy(): Pawn {
        return new Pawn(this._color);
    }

    /** Generate regular moves for pawn */
    private _generateNormalMoves(board: IBoard, fromCoords: ICoordinates): ICoordinates[] {
        let moves: ICoordinates[] = [];
        const toCoords = addCoordinates(fromCoords, {file: 0, rank: this.movementDirection()});
        if(areCoordinatesValid(toCoords) && board.getTile(toCoords).piece == null) {
          moves.push(toCoords);
        }
        return moves;
    }

    /** Generate special first row moves for pawn */
    private _generateFirstRowMoves(board: IBoard, fromCoords: ICoordinates): ICoordinates[] {
        let moves: ICoordinates[] = [];
        const betweenCoords = addCoordinates(fromCoords, { file: 0, rank: this.movementDirection() });
        const toCoords = addCoordinates(
            fromCoords, { file: 0, rank: 2 * this.movementDirection() }
        );
        if(areCoordinatesValid(toCoords) && 
        board.getTile(betweenCoords).piece == null && board.getTile(toCoords).piece == null &&
        (fromCoords.rank === 1 || fromCoords.rank === 6))
            moves.push(toCoords);
        return moves;
    }

    /** Generate special capture moves for pawn */
    private _generateCaptureMoves(board: IBoard, fromCoords: ICoordinates, canGoToEmpty: boolean): ICoordinates[] {
        let moves: ICoordinates[] = [];
        for(let toCoords of [
            addCoordinates(fromCoords, { file: 1, rank: this.movementDirection() }),
            addCoordinates(fromCoords, { file: -1, rank: this.movementDirection() })
        ]) {
            if(areCoordinatesValid(toCoords)) {
                const piece = board.getTile(toCoords).piece;
                if((piece != null && piece.color !== this._color) || canGoToEmpty) {
                    moves.push(toCoords);
                }
            }
        }
        return moves;
    }

    /** Generate special en passant moves for pawn */
    private _generateEnPassantMoves(board: IBoard, fromCoords: ICoordinates): ICoordinates[] {
        let moves: ICoordinates[] = [];
        if(fromCoords.rank === 3 + this._color) {
            for(let toCoords of [
                addCoordinates(fromCoords, { file: 1, rank: this.movementDirection() }),
                addCoordinates(fromCoords, { file: -1, rank: this.movementDirection() })
            ]) {
                const tile = board.getTile({ rank: fromCoords.rank, file: toCoords.file });
                if(tile) {
                    const maybePawn = tile.piece;
                    if(maybePawn && maybePawn instanceof Pawn && 
                        maybePawn.firstRowMoveNumber + 1 === board.moveCount) {
                        moves.push(toCoords);
                    }    
                }  
            }
        }
        return moves;
    }

    /** Override */
    public generateThreatMoves(board: IBoard, fromCoords: ICoordinates): ICoordinates[] {
        return this._generateCaptureMoves(board, fromCoords, true);
    }
    
    /** Override */
    protected _generateMoves(board: IBoard, fromCoords: ICoordinates): ICoordinates[] {
        return this._generateNormalMoves(board, fromCoords)
            .concat(this._generateFirstRowMoves(board, fromCoords)
            .concat(this._generateCaptureMoves(board, fromCoords, false)
            .concat(this._generateEnPassantMoves(board, fromCoords))));
    }

    /** Returns movement direction according to the color of this pawn */
    public movementDirection(): 1 | -1 {
        return this._color === PieceColor.WHITE ? -1 : 1;
    }

    /** Override */
    public move(board: IBoard, toCoords: ICoordinates, generateInfoObject: boolean): IMove {
        this._markFirstRowMove(board, toCoords);
        const enPassant = this._attemptEnPassant(board, toCoords);
        const mv = super.move(board, toCoords, generateInfoObject);
        if(enPassant) {
            mv.capture = true;
        }
        this._attemptPromotion(toCoords);
        return mv;
    }

    /** Saves the data about the first move for en passant purposes */
    private _markFirstRowMove(board: IBoard, toCoords: ICoordinates): void {
        if(Math.abs(this._tile.coords.rank - toCoords.rank) === 2)
            this.firstRowMoveNumber = board.moveCount;
    }

    /** Attempts en passant */
    private _attemptEnPassant(board: IBoard, toCoords: ICoordinates): boolean {
        const fromCoords = this._tile.coords;
        const isCapture = board.getTile(toCoords).piece != null;
        if(!isCapture) {
            const dRank = fromCoords.rank - toCoords.rank;
            const dFile = fromCoords.file - toCoords.file;
            if(Math.abs(dRank) === 1 && Math.abs(dFile) === 1) {
                board.getTile(addCoordinates(toCoords, {rank: dRank, file: 0})).piece = null;
                return true;
            }
                
        }
        return false;   
    }

    /** Attempts promotion */
    private _attemptPromotion(coords: ICoordinates): void {
        const lastRank = this._color === PieceColor.WHITE ? 0 : 7;
        if(coords.rank === lastRank) {
            this._tile.piece = new Queen(this._color);
            this._tile.piece.tile = this._tile;
        }
    }

    /** GETTERS AND SETTERS */

    public get firstRowMoveNumber(): number {
        return this._firstRowMoveNumber;
    }

    public set firstRowMoveNumber(value: number) {
        this._firstRowMoveNumber = value;
    }
}