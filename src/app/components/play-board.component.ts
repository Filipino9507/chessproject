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
    template: `
        <div class="center-content">

            <div class="board-container">
                <div class="board-rank" *ngFor="let _ of board.tileArray; let rank = index; let evenRank = even">
                    <!-- TO BE REFACTORED FROM WITHIN .TS FILE -->
                    <!-- <span>{{ gameSettings.playerColor === 0 ? 8 - i : i + 1 }}</span> -->
                    <button 
                    *ngFor="let _ of board.tileArray[rank]; let file = index; let evenFile = even"
                    [ngClass]="[
                        'tile', 
                        evenRank === evenFile ? 'white-tile' : 'black-tile',
                        board.tileArray[rank][file].highlighted ? 'highlighted-tile' : ''
                    ]"
                    (click)="clickTile({rank: rank, file: file})">
                    {{ board.tileArray[rank][file].piece != null ? board.tileArray[rank][file].piece.symbol : '‎' }} 
                    </button>
                </div>
            </div>

            <div class="timer-container">
                <h4 *ngFor="let secs of secondsLeft.reverse()">
                    Time left: {{ Math.floor(secs / 60) }}:{{ secs % 60 | number: '2.0-0' }}
                </h4>
            </div>

        </div>
    `,
    styles: [
        `div.board-container {
            margin: 0 auto;
            display: inline-block;
        }
        div.board-rank {
            height: 75px;
        }`,

        `button.tile {
            width: 75px;
            height: 75px;
            border: 1px solid black;
            padding: 0px;
            font-size: 70px;
        }
        button.white-tile {
            background-color: rgb(155, 248, 255);
        }
        button.black-tile {
            background-color: rgb(28, 115, 150);
        }
        button.highlighted-tile {
            background-color: rgba(255, 0, 0, 0.76);
        }`,
        
        `div.timer-container {
            margin: 0 auto;
            padding: 30px;
            display: inline-block;
        }`
    ]
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
