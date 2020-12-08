import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IGameSettings } from '@app/shared/game-settings';
import { Board } from '@app/shared/board';
import { ITile, ICoordinates } from '@app/shared/tile';
import { PieceColor } from '@app/shared/piece/piece-color';
import { IGameResults, GameResultReason } from '@app/shared/game-results';

/**
 * Board component
 * Holds the board object, remaining time data, and data necessary for UI to function.
 */
@Component({
    selector: 'app-play-board',
    templateUrl: './play-board.component.html',
    styleUrls: ['./play-board.component.scss']
})
export class PlayBoardComponent implements OnInit {

    /** Allows usage of Math in component */
    public Math = Math;

    /** Board object */
    public board: Board;

    /** How many seconds are left for each side */
    public secondsLeft: PieceColor[];

    /** Which player is active */
    private _activePlayerColor: PieceColor;

    /** Which tile is currently selected */
    private _selectedTile: ITile;

    /** Possibilities of movement from the currently selected tile */
    private _selectedTilePossibilities: ICoordinates[];

    /** Game settings input (received from play-options) */
    @Input() public gameSettings: IGameSettings;

    /** Game results output (given to play-end-game) */
    @Output() public endGameEventEmitter = new EventEmitter<IGameResults>();

    /** Constructor */
    public constructor() { }

    /** On init */
    public ngOnInit(): void {
        this._initializeFields();
        this.board = new Board();
        this._initializeTimer();
    }

    /** Initializes the object fields */
    private _initializeFields(): void {
        this._activePlayerColor = PieceColor.WHITE;
        this._selectedTile = null;
        this._selectedTilePossibilities = null;
    }

    /** Initializes game timer, sets interval for seconds decrease and end condition */
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

    /** Handles a tile being clicked */
    public clickTile(coords: ICoordinates): void {
        if(this._selectedTile == null)
            this._attemptInitiateMove(coords);   
        else 
            this._attemptExecuteMove(coords);
    }

    /** Attempts to initiate a move if no tile is currently selected */
    private _attemptInitiateMove(coords: ICoordinates): void {
        const fromTile = this.board.getTile(coords);
        if(fromTile.piece != null && fromTile.piece.color === this._activePlayerColor) {
            this._selectedTile = fromTile;
            this._selectedTilePossibilities = fromTile.piece.generatePossibleMoves(this.board, coords);
            this.board.highlightSquares(this._selectedTilePossibilities);
        }
    }

    /** Attempts to execute a move if a tile is currently selected */
    private _attemptExecuteMove(coords: ICoordinates): void {
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

    /** Handles all of the events during passing of a turn */
    private _handlePassTurn(): void {
        this.board.moveCount++;
        this.board.updateThreatMoves();
        this.secondsLeft[this._activePlayerColor] += this.gameSettings.secondsIncrement;
        this._passActivePlayerColors();
        this.handleGameEnd();
    }


    /** Changes active player color to the opposite */
    private _passActivePlayerColors(): void {
        this._activePlayerColor = this._activePlayerColor === PieceColor.WHITE ? 
            PieceColor.BLACK : PieceColor.WHITE;
    }

    /** Handles game end and sends the information about it via endGameEmitter */
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
