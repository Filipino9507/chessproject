import { Injectable } from '@angular/core';
import { ECastling, IMove } from '@app/shared/tile';
import { IBoard } from '@app/shared/board/board-interface';
import { areCoordinatesEqual } from '@app/shared/board/board-utility';
import { PieceColor } from '@app/shared/piece/piece-color';

@Injectable({
    providedIn: 'root'
})
export class GameRepresentationManager {

    /** Reads file and returns a callback which runs when the file content is loaded*/
    public readFile(target: HTMLInputElement, onLoadCallback: (result: any) => void): void {
        const file = target.files[0];
        if(!file)
            return;
        const reader = new FileReader();
        reader.onload = () => onLoadCallback(reader.result);
        reader.readAsText(file);    
    }

    /** Writes to file */
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

    // /** Converts a list of moves into a representation that gets then saved */
    // public toRepresentation(moveList: IMove[]): string {
    //     let representation = '';
    //     const len = moveList.length;
    //     for(let i = 0; i < len; i++) {
    //         const move = moveList[i];
    //         let moveRepr = move.fromCoords.rank.toString() + move.fromCoords.file.toString()
    //             + move.toCoords.rank.toString() + move.toCoords.file.toString();
    //         if(i !== len - 1)
    //             moveRepr += ';';
    //         representation += moveRepr;
    //     }
    //     return representation;
    // }

    // /** Converts the saved game representation back into a list of moves */
    // public toMoveList(representation: string): IMove[] {
    //     if(representation.length === 0)
    //         return [];
    //     const moveList = [];
    //     const moveReprList = representation.replace(/\s+/g, '').split(';');
    //     for(const moveRepr of moveReprList) {
    //         if(moveRepr.length !== 4)
    //             return null;
    //         const [fRank, fFile, tRank, tFile] = moveRepr.split('')
    //             .map(c => parseInt(c));
    //         const fromCoords = {rank: fRank, file: fFile};
    //         const toCoords = {rank: tRank, file: tFile};
    //         moveList.push({fromCoords, toCoords});
    //     }
    //     return moveList;
    // }

    /** Gets the human readable representation of one move */
    private _toHumanRepresentationOneMove(move: IMove): string {
        switch(move.castling) {
            case ECastling.NONE:
                let specifyRepr = '';
                if(move.specifyFile) {
                    specifyRepr += this._fileToHuman(move.specifyFile);
                }
                if(move.specifyRank) {
                    specifyRepr += this._rankToHuman(move.specifyRank);
                }
                const captureRepr = move.capture ? 'x' : '';
                const fileRepr = this._fileToHuman(move.toCoords.file);
                const rankRepr = this._rankToHuman(move.toCoords.rank);
                

                return move.pieceSymbol + specifyRepr + captureRepr + fileRepr + rankRepr;

            case ECastling.KING_SIDE:
                return 'O-O';

            case ECastling.QUEEN_SIDE:
                return 'O-O-O';
        }
    }

    /** Gets the human readable representation of moves played in a board */
    public toHumanRepresentation(board: IBoard): string {
        const playedMoves = board.playedMoves;
        const len = playedMoves.length;
        let repr = '';
        for(let i = 0; i < len; i++) {
            if(i % 2 === 0) 
                repr += (i / 2 + 1).toString() + '. ';
            repr += this._toHumanRepresentationOneMove(playedMoves[i]);
            repr += i % 2 === 0 ? '\t\t' : '\n';
        }
        return repr;
    }

    /** Converts the human representation of castling into the move object and performs the move */
    private _fromHumanRepresentationOneMoveCastling(board: IBoard, representation: string, player: PieceColor): IMove {
        let dFile: number;
        if(representation.length === 3) {
            dFile = 2;
        } else if(representation.length === 5) {
            dFile = -2;
        } else
            throw new Error('Invalid castling notation.');
        const rank = player === 0 ? 7 : 0;
        const king = board.getTile({ file: 4, rank }).piece;
        if(king && king.checkable) {
            const mv = king.move(board, { file: 4 + dFile, rank }, true);
            board.playedMoves.push(mv);
            ++board.moveCount;
            return mv;
        }
    }

    /** Converts the human representation of a regular move into the move object and performs the move */
    private _fromHumanRepresentationOneMoveRegular(board: IBoard, representation: string): IMove {
        representation = representation.replace('x', '').trim();
        console.log('HERE YOU GO: ', representation, representation.length);
        const len = representation.length;
        const toCoords =  {
            file: this._fileFromHuman(representation[len - 2]),
            rank: this._rankFromHuman(representation[len - 1])
        };
        let specifyRank = null, specifyFile = null;
        switch(len) {
            case 3: break;
            case 4:
                const spec = representation[1];
                if(/\d/.test(spec)) specifyRank = this._rankFromHuman(spec);
                else specifyFile = this._fileFromHuman(spec);
                break;
            case 5:
                specifyFile = this._fileFromHuman(representation[1]);
                specifyRank = this._rankFromHuman(representation[2]);
                break;
            default: throw new Error('Invalid move notation.');
        }

        const symbol = representation[0];
        const tileArray = board.tileArray;
        for(const rank of tileArray) {
            for(const tile of rank) {
                const piece = tile.piece;
                if(piece && piece.symbol === symbol) {
                    const pieceCoords = piece.tile.coords;
                    if(specifyRank && specifyRank !== pieceCoords.rank)
                        continue;
                    if(specifyFile && specifyFile !== pieceCoords.file)
                        continue;
                    const pieceMoves = piece.generatePossibleMoves(board, pieceCoords);
                    for(const move of pieceMoves) {
                        if(areCoordinatesEqual(move, toCoords)) {
                            const mv = piece.move(board, toCoords, true);
                            board.playedMoves.push(mv);
                            ++board.moveCount
                            return mv;
                        }
                    }
                } 
            }
        }
        throw new Error('Invalid move.');
    }

    /** Converts the human representation of one move into the move object and performs the move */
    private _fromHumanRepresentationOneMove(board: IBoard, representation: string, player: PieceColor): IMove {
        representation = representation.trim();
        switch(representation[0]) {
            case 'O':
                return this._fromHumanRepresentationOneMoveCastling(board, representation, player);
            default:
                return this._fromHumanRepresentationOneMoveRegular(board, representation);
        } 
    }

    /** Converts the human representation to a list of moves */
    public fromHumanRepresentation(board: IBoard, representation: string): IMove[] {
        board.reset();
        representation = '\n' + representation;
        const splitRepresentation = representation.split(/\n\d+\. /).slice(1);
        console.log(splitRepresentation);

        let playedMoves = [];
        for(const pairRepr of splitRepresentation) {
            const twoReprs = pairRepr.split('\t\t');
            for(let i = 0; i < twoReprs.length; ++i) {
                const moveRepr = twoReprs[i];
                if(moveRepr.length !== 0) {
                    playedMoves.push(
                        this._fromHumanRepresentationOneMove(board, moveRepr, i % 2)
                    );
                }
            }
        }
        return playedMoves;
    }

    /** Converts human rank to computer rank */
    private _rankFromHuman(human: string): number {
        return 8 - +human;
    }

    /** Converts human rank to computer rank */
    private _fileFromHuman(human: string): number {
        return human.charCodeAt(0) - 97;
    }

    /** Converts human rank to computer rank */
    private _rankToHuman(computer: number): string {
        return (8 - computer).toString();
    }

    /** Converts human rank to computer rank */
    private _fileToHuman(computer: number): string {
        return String.fromCharCode(computer + 97);
    }
  }
