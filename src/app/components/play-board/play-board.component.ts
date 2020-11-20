import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IGameSettings } from '@app/shared/game-settings';
import { Board } from '@app/shared/board';
import { ITile, ICoordinates } from '@app/shared/tile';
import { PieceColor } from '@app/shared/piece/piece-color';
import { IGameResults, GameResultReason } from '@app/shared/game-results';

@Component({
    selector: 'app-play-board',
    templateUrl: './play-board.component.html',
    styleUrls: ['./play-board.component.scss']
})
export class PlayBoardComponent implements OnInit {

    public Math = Math;

    public board: Board;
    public secondsLeft: PieceColor[];

    private _activePlayerColor: PieceColor;
    private _selectedTile: ITile;
    private _selectedTilePossibilities: ICoordinates[];

    @Input() public gameSettings: IGameSettings;
    @Output() public endGameEventEmitter = new EventEmitter<IGameResults>();

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
    }

    private _initializeTimer(): void {
        this.secondsLeft = new Array(2);
        this.secondsLeft.fill(this.gameSettings.secondsToThink);
        const interval = setInterval(() => {
            --this.secondsLeft[this._activePlayerColor];
            if(this.secondsLeft[this._activePlayerColor] <= 0) {
                clearInterval(interval);
                this._passActivePlayerColors();
                this.endGameEventEmitter.emit({
                    winner: this._activePlayerColor,
                    reason: GameResultReason.TIME_OUT,
                    boardState: this.board,
                    gameSettings: this.gameSettings
                });
            }
        }, 1000);
    }

    public clickTile(coords: ICoordinates): void {
        if(this._selectedTile == null)
            this._attemptInitiateMove(coords);   
        else 
            this._attemptExecuteMove(coords);
    }

    private _attemptInitiateMove(coords): void {
        const fromTile = this.board.getTile(coords);
        if(fromTile.piece != null && fromTile.piece.color === this._activePlayerColor) {
            this._selectedTile = fromTile;
            this._selectedTilePossibilities = fromTile.piece.generatePossibleMoves(this.board, coords);
            this.board.highlightSquares(this._selectedTilePossibilities);
        }
    }

    private _attemptExecuteMove(coords): void {
        const toTile = this.board.getTile(coords);
        const hasSameColorPiece = toTile.piece != null && 
            toTile.piece.color === this._activePlayerColor;

        if(Board.areCoordinatesInArray(coords, this._selectedTilePossibilities) && !hasSameColorPiece) {
            this._selectedTile.piece.move(this.board, coords);
            this._handlePassTurn();
        }

        this.board.clearHighlightedSquares();
        if(hasSameColorPiece && toTile !== this._selectedTile) {
            this._attemptInitiateMove(coords);
        } else {
            this._selectedTile = null;
            this._selectedTilePossibilities = null;
        }
    }

    private _handlePassTurn(): void {
        this.board.moveCount++;
        this.board.updateThreatMoves();
        this.secondsLeft[this._activePlayerColor] += this.gameSettings.secondsIncrement;
        this._passActivePlayerColors();
        this.handleGameEnd();
    }

    private _passActivePlayerColors(): void {
        this._activePlayerColor = this._activePlayerColor === PieceColor.WHITE ? 
            PieceColor.BLACK : PieceColor.WHITE;
    }

    private handleGameEnd(): void {
        const allPossibleMoves = this.board.generateAllPossibleMoves(this._activePlayerColor);
        if(allPossibleMoves.length === 0) {
            const isStalemate = Board.isKingSafeOnBoard(this.board, this._activePlayerColor);
            this._passActivePlayerColors();
            const winner = isStalemate ? null : this._activePlayerColor;
            const reason = isStalemate ? GameResultReason.STALEMATE : GameResultReason.CHECKMATE;
            this.endGameEventEmitter.emit({
                winner,
                reason,
                boardState: this.board,
                gameSettings: this.gameSettings,
            });
        }
    }
}
