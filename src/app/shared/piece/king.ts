import { IBoard } from '@app/shared/board/board-interface';
import { BOARD_DIMEN, areCoordinatesValid, addCoordinates } from '@app/shared/board/board-utility';
import { ECastling, ICoordinates, IMove } from '@app/shared/tile';
import { Piece } from '@app/shared/piece/piece';
import { Rook } from '@app/shared/piece/rook';

export class King extends Piece {

    protected readonly _symbols = ['♔', '♚'];
    protected readonly _value = 0;
    protected readonly _checkable = true;

    /** Override */
    public copy(): King {
        return new King(this._color);
    }

    /** Generates normal moves for the king */
    private _generateKingMoves(fromCoords: ICoordinates): ICoordinates[] {
        let moves: ICoordinates[] = [];
        for(let dRank = -1; dRank <= 1; dRank++) {
            for(let dFile = -1; dFile <= 1; dFile++) {
                if(dRank === 0 && dFile === 0) 
                    continue;
                const toCoords = addCoordinates(fromCoords, {file: dFile, rank: dRank});
                if(areCoordinatesValid(toCoords))
                    moves.push(toCoords);
            }
        }
        return moves;
    }

    /** Generates special castling moves for the king */
    private _generateCastlingMoves(board: IBoard, fromCoords: ICoordinates): ICoordinates[] {
        if(this._hasMoved) 
            return []; 
        let moves: ICoordinates[] = [];
        for(const coords of [
            {rank: fromCoords.rank, file: 0}, 
            {rank: fromCoords.rank, file: BOARD_DIMEN-1}
        ]) {
            const maybeRook = board.getTile(coords).piece;
            if(maybeRook == null || !(maybeRook instanceof Rook) || maybeRook.hasMoved)
                continue;
            const direction = Math.sign(coords.file - fromCoords.file);
            const betweenCoords = addCoordinates(fromCoords, {rank: 0, file: direction});
            const destinationCoords = addCoordinates(
                fromCoords, {rank: 0, file: 2 * direction}
            );

            const needToBeEmpty = [betweenCoords];
            if(direction === -1)
                needToBeEmpty.push(addCoordinates(fromCoords, {rank: 0, file: -3}));
            const isPathEmpty = needToBeEmpty.every(coords => board.getTile(coords).piece == null);

            if(board.accessibleByKing(fromCoords, this._color) &&
                board.accessibleByKing(betweenCoords, this._color) && 
                board.accessibleByKing(destinationCoords, this._color) && isPathEmpty)
                moves.push(destinationCoords);
        }
        return moves;
    }

    /** Override */
    protected _generateMoves(board: IBoard, fromCoords: ICoordinates): ICoordinates[] {
        return this._generateKingMoves(fromCoords)
            .concat(this._generateCastlingMoves(board, fromCoords));
    }

    /** Override */
    public generateThreatMoves(board: IBoard, fromCoords: ICoordinates): ICoordinates[] {
        return this._generateKingMoves(fromCoords);
    }

    /** Override */
    public move(board: IBoard, toCoords: ICoordinates, specifyPosition: boolean): IMove {
        const castling = this._attemptCastling(board, toCoords);
        const mv = super.move(board, toCoords, specifyPosition);
        mv.castling = castling;
        return mv;
    }

    /** Attempts castling, making all of the necessary moves */
    private _attemptCastling(board: IBoard, toCoords: ICoordinates): ECastling {
        const fromCoords = this._tile.coords;
        const dFile = toCoords.file - fromCoords.file;
        if(Math.abs(dFile) === 2) {
            if(dFile > 0) {
                const rook = board.getTile(addCoordinates(fromCoords, {rank: 0, file: 3})).piece;
                rook.move(board, addCoordinates(fromCoords, {rank: 0, file: 1}), false);
                return ECastling.KING_SIDE;
            } else {
                const rook = board.getTile(addCoordinates(fromCoords, {rank: 0, file: -4})).piece;
                rook.move(board, addCoordinates(fromCoords, {rank: 0, file: -1}), false);
                return ECastling.QUEEN_SIDE;
            }
        }
        return ECastling.NONE;
    }
}
