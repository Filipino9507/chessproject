import { Piece, PieceColor,
Pawn, Knight, Bishop, Rook, Queen, King } from '@app/shared/piece'; 

export interface ITile {
    coords: ICoordinates;
    highlighted: boolean;
    piece: Piece;
    threatenedBy: Set<Piece>;
}

export interface ICoordinates {
    file: number;
    rank: number;
}

export class Board {

    public static readonly BOARD_DIMEN = 8;

    private _tileArray: ITile[][];

    constructor() {
        this._initializeTileArray();
        this.updatePossibleMoves();
    }

    public getTile(coords: ICoordinates): ITile {
        return this._tileArray[coords.rank][coords.file];
    }

    public get tileArray(): ITile[][] {
        return this._tileArray;
    }

    private _initializeTileArray(): void {
        this._tileArray = new Array(Board.BOARD_DIMEN);

        for(let rank = 0; rank < Board.BOARD_DIMEN; rank++) {
            this._tileArray[rank] = new Array(Board.BOARD_DIMEN);

            const color = rank > 3  ? PieceColor.WHITE : PieceColor.BLACK;

            for(let file = 0; file < Board.BOARD_DIMEN; file++) {
                let piece;
                switch(rank) {
                    case 0: case 7:
                        switch(file) {
                        case 3: piece = new Queen(color); break;
                        case 4: piece = new King(color); break;
                        case 0: case 7: piece = new Rook(color); break;
                        case 1: case 6: piece = new Knight(color); break;
                        default: piece = new Bishop(color); break;
                        } 
                        break;
                    case 1: case 6: piece = new Pawn(color); break;
                    default: piece = null;
                }

                this._tileArray[rank][file] = {
                    coords: {file, rank}, 
                    highlighted: false, 
                    piece: piece,
                    threatenedBy: new Set()
                };

                if(piece != null)
                    this._tileArray[rank][file].piece.tile = this._tileArray[rank][file];
            }
        }
    }

    private clearPossibleMoves() {
        for(let rank of this._tileArray) {
            for(let tile of rank) {
                tile.threatenedBy.clear();
            }
        }
    }

    public updatePossibleMoves() {
        this.clearPossibleMoves();
        for(let rank = 0; rank < Board.BOARD_DIMEN; rank++) {
            for(let file = 0; file < Board.BOARD_DIMEN; file++) {
                const piece = this._tileArray[rank][file].piece;
                if(piece != null)
                   piece.updateBoardPossibleMoves(this, {rank, file});
            }
        }
    }

    public movePiece(fromCoords: ICoordinates, toCoords: ICoordinates): void {
        const fromTile = this.getTile(fromCoords);
        const toTile = this.getTile(toCoords);

        toTile.piece = fromTile.piece;
        fromTile.piece = null;
        toTile.piece.tile = fromTile;
    }

    public static contains(coords: ICoordinates): boolean {
        return coords.rank >= 0 && coords.rank < Board.BOARD_DIMEN && 
        coords.file >= 0 && coords.file < Board.BOARD_DIMEN;
    }

    public static areEqual(coords1: ICoordinates, coords2: ICoordinates): boolean {
        return coords1.rank === coords2.rank && coords1.file === coords2.file;
    }

    public static addCoordinates(coords1: ICoordinates, coords2: ICoordinates): ICoordinates {
        return {file: coords1.file + coords2.file, rank: coords1.rank + coords2.rank};
    }
}