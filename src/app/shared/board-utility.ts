import { IBoard } from '@app/shared/board-interface';
import { ICoordinates } from '@app/shared/tile';
import { PieceColor } from '@app/shared/piece/piece-color';
import { King } from '@app/shared/piece/king';

export const BOARD_DIMEN = 8;

/** Checks if king of a given color is safe on a given board */
export function isKingSafeOnBoard(board: IBoard, kingColor: PieceColor): boolean {
    let safeKing = true;
    for (let rank = 0; rank < BOARD_DIMEN; rank++) {
        for(let file = 0; file < BOARD_DIMEN; file++) {
            const coords: ICoordinates = {rank, file};
            const maybeKing = board.getTile(coords).piece;
            if(maybeKing != null && maybeKing instanceof King &&
                maybeKing.color === kingColor &&
                !board.accessibleByKing(coords, kingColor)) {
                    safeKing = false;
                }      
        }
    }
    return safeKing;
}

/** Generates a copy of a board after the given move */
export function generateBoardAfterMove(board: IBoard, fromCoords: ICoordinates, toCoords: ICoordinates): IBoard {
    const alternativeBoard = board.copy();
    const movingPiece = alternativeBoard.getTile(fromCoords).piece;
    movingPiece.move(alternativeBoard, toCoords);
    alternativeBoard.updateThreatMoves();
    return alternativeBoard;
}

/** Check whether the given coordinates exist within the board */
export function areCoordinatesValid(coords: ICoordinates): boolean {
    return coords.rank >= 0 && coords.rank < BOARD_DIMEN && 
    coords.file >= 0 && coords.file < BOARD_DIMEN;
}

/** Returns whether two coordinates are equal */
export function areCoordinatesEqual(coords1: ICoordinates, coords2: ICoordinates): boolean {
    return coords1.rank === coords2.rank && coords1.file === coords2.file;
}

/** Returns two coordinates added together */
export function addCoordinates(coords1: ICoordinates, coords2: ICoordinates): ICoordinates {
    return {file: coords1.file + coords2.file, rank: coords1.rank + coords2.rank};
}

/** Returns coordinates object multiplied by a scalar value */
export function scaleCoordinates(coords: ICoordinates, scale: number): ICoordinates {
    return {file: scale * coords.file, rank: scale * coords.rank};
}

/** Checks whether an array contains given coordinates */
export function areCoordinatesInArray(coords: ICoordinates, array: ICoordinates[]): boolean {
    for(let elt of array)
        if(areCoordinatesEqual(elt, coords)) 
            return true;
    return false;
}
