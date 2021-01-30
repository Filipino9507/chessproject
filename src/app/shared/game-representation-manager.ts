import { Injectable } from "@angular/core";
import { ICoordinates } from "@app/shared/tile";
import { areCoordinatesValid } from '@app/shared/board-utility';
import { provideRoutes } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class GameRepresentationManager {

    public readFile(target: HTMLInputElement, onLoadCallback: (result: any) => void): void {
        const file = target.files[0];
        if(!file)
            return;
        const reader = new FileReader();
        reader.onload = () => onLoadCallback(reader.result);
        reader.readAsText(file);    
    }

    // public toRepresentation(moveList: {fromCoords: ICoordinates, toCoords: ICoordinates}[]): string {
        
    // }

    public toMoveList(representation: string): {fromCoords: ICoordinates, toCoords: ICoordinates}[] {
        const moveList = [];
        const moveReprList = representation.replace(/\s+/g, '').split(';');
        for(const moveRepr of moveReprList) {
            if(moveRepr.length !== 4)
                return null;
            const [fRank, fFile, tRank, tFile] = moveRepr.split('')
                .map(c => parseInt(c));
            const fromCoords = {rank: fRank, file: fFile};
            const toCoords = {rank: tRank, file: tFile};
            moveList.push({fromCoords, toCoords});
        }
        return moveList;
    }
}



