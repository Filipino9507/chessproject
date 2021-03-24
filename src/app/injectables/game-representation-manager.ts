import { Injectable } from '@angular/core';
import { ECastling, IMove } from '@app/shared/tile';
import { IBoard } from '@app/shared/board/board-interface';

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

    public writeFile(data: string, filename: string): void {
        const file = new Blob([data]);
        if(window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(file, filename);
        } else {
            const a = document.createElement('a');
            const url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    }

    public toRepresentation(moveList: IMove[]): string {
        let representation = '';
        const len = moveList.length;
        for(let i = 0; i < len; i++) {
            const move = moveList[i];
            let moveRepr = move.fromCoords.rank.toString() + move.fromCoords.file.toString()
                + move.toCoords.rank.toString() + move.toCoords.file.toString();
            if(i !== len - 1)
                moveRepr += ';';
            representation += moveRepr;
        }
        return representation;
    }

    public toMoveList(representation: string): IMove[] {
        if(representation.length === 0)
            return [];
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

    private _getMoveHumanRepr(move: IMove): string {
        switch(move.castling) {
            case ECastling.NONE:
                const fileRepr = String.fromCharCode(move.toCoords.file + 97);
                const rankRepr = 8 - move.toCoords.rank;
                const captureRepr = move.capture ? 'x' : '';
                return move.pieceSymbol + captureRepr + fileRepr + rankRepr;
            case ECastling.KING_SIDE:
                return 'O-O';
            case ECastling.QUEEN_SIDE:
                return 'O-O-O';
        }
    }

    public toHumanRepresentation(board: IBoard): string {
        const playedMoves = board.playedMoves;
        const len = playedMoves.length;
        let repr = '';
        for(let i = 0; i < len; i++) {
            if(i % 2 === 0) 
                repr += (i / 2 + 1).toString() + '. ';
            repr += this._getMoveHumanRepr(playedMoves[i]);
            repr += i % 2 === 0 ? '\t\t' : '\n';
        }
        return repr;
    }
}
