import { ICoordinates } from '@app/shared/tile';

export const BOARD_DIMEN = 8;

/** Check whether the given coordinates exist within the board */
export function areCoordinatesValid(coords: ICoordinates): boolean {
    return !isNaN(coords.rank) && !isNaN(coords.file) &&
        coords.rank >= 0 && coords.rank < BOARD_DIMEN && 
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
