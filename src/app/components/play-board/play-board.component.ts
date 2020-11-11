import { Component, Input, OnInit } from '@angular/core';
import { IGameSettings } from '@app/shared/models';
import { Board } from '@app/shared/board';
import { ITile, ICoordinates } from '@app/shared/tile';
import { PieceColor } from '@app/shared/piece/piece-color';

@Component({
    selector: 'app-play-board',
    templateUrl: './play-board.component.html',
    styleUrls: ['./play-board.component.scss']
})
export class PlayBoardComponent implements OnInit {

    Math = Math;  // Enables Math module in template

    public board: Board;
    public secondsLeft: PieceColor[];

    private _activePlayerColor: PieceColor;
    private _selectedTile: ITile;
    private _selectedTilePossibilities: ICoordinates[];
    private _moveCount: number;

    @Input() public gameSettings: IGameSettings;

    public constructor() { }

    public ngOnInit(): void {
        this._initializeFields();
        this.board = new Board();
        this._initializeTimer();
    }

    private _initializeFields(): void {
        this._activePlayerColor = PieceColor.WHITE;
        this._selectedTile = null;
        this._selectedTilePossibilities = null;
        this._moveCount = 0;
    }

    private _initializeTimer(): void {
        this.secondsLeft = new Array(2);
        this.secondsLeft.fill(this.gameSettings.secondsToThink);
        setInterval(_ => {
            --this.secondsLeft[this._activePlayerColor];
            if(this.secondsLeft[this._activePlayerColor] <= 0) {
                // EMIT SIGNAL TO END THE GAME
                clearInterval();
            }
        }, 1000);
    }

    public clickTile(coords: ICoordinates): void {
        if(this._selectedTile == null)
            this.attemptInitiateMove(coords);   
        else 
            this.attemptExecuteMove(coords);
    }

    private attemptInitiateMove(coords): void {
        const fromTile = this.board.getTile(coords);
        if(fromTile.piece != null && fromTile.piece.color === this._activePlayerColor) {
            this._selectedTile = fromTile;
            this._selectedTilePossibilities = fromTile.piece.generatePossibleMoves(this.board, coords);
            this.board.highlightSquares(this._selectedTilePossibilities);
        }
    }

    private attemptExecuteMove(coords): void {
        const toTile = this.board.getTile(coords);
        const hasSameColorPiece = toTile.piece != null && 
            toTile.piece.color === this._activePlayerColor;

        if(Board.areCoordinatesInArray(coords, this._selectedTilePossibilities) && !hasSameColorPiece) {
            this._selectedTile.piece.move(this.board, coords);
            this.board.moveCount++;
            this.board.updateThreatMoves();
            this.passTurn();
        }

        this.board.clearHighlightedSquares();
        this.handleGameEnd();

        if(hasSameColorPiece && toTile !== this._selectedTile) {
            this.attemptInitiateMove(coords);
        } else {
            this._selectedTile = null;
            this._selectedTilePossibilities = null;
        }
    }

    private passTurn(): void {
        this._activePlayerColor = this._activePlayerColor === PieceColor.WHITE ? 
            PieceColor.BLACK : PieceColor.WHITE;
    }

    private handleGameEnd(): void {
        const allPossibleMoves = this.board.generateAllPossibleMoves(this._activePlayerColor);
        if(allPossibleMoves.length === 0) {
            console.log('GAME END');
            if(Board.isKingSafeOnBoard(this.board, this._activePlayerColor)) 
                console.log('STALEMATE');
            else
                console.log('CHECKMATE');
        }
    }
}
