import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IGameSettings } from '@app/shared/game-settings';
import { Board } from '@app/shared/board';
import { areCoordinatesInArray, BOARD_DIMEN, isKingSafeOnBoard } from '@app/shared/board-utility';
import { ITile, ICoordinates } from '@app/shared/tile';
import { PieceColor } from '@app/shared/piece/piece-color';
import { IGameResults } from '@app/shared/game-results';
import { EGameResultReason } from '@app/shared/game-result-reason';
import { GameRepresentationManager } from '@app/shared/game-representation-manager';


enum EConfirmationDialogMode { NONE, RESIGN, DRAW, TAKEBACK }

/**
 * Board component
 * Holds the board object, remaining time data, and data necessary for UI to function.
 */
@Component({
    selector: 'app-play-board',
    template: `
        <div id="main-container">
            <nb-card>
                <nb-card-body id="board-container">
                    <div class="board-rank" *ngFor="let _ of board.tileArray; let _rank = index; let evenRank = even">
                        <div class="board-rank" *ngVar="getDisplayedRank(_rank) as rank">
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
                </nb-card-body>
            </nb-card>
            <nb-card>
                <nb-card-body id="side-container">
                    <h3 class="timer"> Time left: {{ getDisplayedTimer(0) }} </h3>
                    <nb-card status="primary">
                        <nb-card-header>Game controls</nb-card-header>
                        <nb-card-body class="ui-container" *ngIf="confirmationDialogMode === EConfirmationDialogMode.NONE">
                            <button 
                                class="game-control" 
                                nbButton
                                size="medium" 
                                status="primary"
                                (click)="confirmationDialogMode = EConfirmationDialogMode.RESIGN">
                                Resign
                            </button>
                            <button 
                                class="game-control" 
                                nbButton 
                                size="medium" 
                                status="primary"
                                (click)="confirmationDialogMode = EConfirmationDialogMode.DRAW">
                                Offer draw
                            </button>
                            <button 
                                class="game-control" 
                                nbButton 
                                size="medium" 
                                status="primary"
                                (click)="confirmationDialogMode = EConfirmationDialogMode.TAKEBACK">
                                Propose takeback
                            </button>
                            <input
                                #self
                                nbInput
                                type="file"
                                (change)="loadGame(self)" 
                            />
                        </nb-card-body>
                        <nb-card-body class="ui-container" *ngIf="confirmationDialogMode !== EConfirmationDialogMode.NONE">
                            <p>{{ getConfirmationDialogString() }}</p>
                            <button 
                                class="game-control" 
                                nbButton
                                size="medium" 
                                status="primary"
                                (click)="confirmDialog()">
                                Yes
                            </button>
                            <button 
                                class="game-control" 
                                nbButton
                                size="medium" 
                                status="primary"
                                (click)="cancelDialog()">
                                No
                            </button>
                        </nb-card-body>
                    </nb-card>
                    <h3 class="timer">Time left: {{ getDisplayedTimer(1) }} </h3>
                </nb-card-body>
            </nb-card> 
        </div>
    `,
    styles: [
        `#main-container {
            display: flex;
            flex-direction: row;
        }`,

        `#side-container {
            margin: 0 auto;
            padding: 30px;
            display: flex;
            flex-direction: column;
        }
        .ui-container {
            display: flex;
            flex-direction: column;
        }
        #board-container {
            margin: 0 auto;
            display: inline-block;
        }
        .timer {
            display: flex;
            justify-content: center;
            align-items: center;
            flex: 1;
        }
        button.game-control {
            margin: 5px;
        }`,

        `div.board-rank {
            height: 75px;
            display: flex;
        }
        button.tile {
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
        }`
    ]
})
export class PlayBoardComponent implements OnInit {
    /** Allows usage inside component */
    // public Math = Math;
    public EConfirmationDialogMode = EConfirmationDialogMode;

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

    /** The type of dialog which is currently going on */
    public confirmationDialogMode: EConfirmationDialogMode;

    /** Game settings input (received from play-options) */
    @Input() public gameSettings: IGameSettings;

    /** Game results output (given to play-end-game) */
    @Output() public endGameEventEmitter = new EventEmitter<IGameResults>();

    /** Constructor */
    public constructor(public gameRepresentationManager: GameRepresentationManager) { }

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
        this.confirmationDialogMode = EConfirmationDialogMode.NONE;
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
                    reason: EGameResultReason.TIME_OUT,
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

        if(areCoordinatesInArray(coords, this._selectedTilePossibilities) && !hasSameColorPiece) {
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
        this._handleGameEnd();
    }

    /** Changes active player color to the opposite */
    private _passActivePlayerColors(): void {
        this._activePlayerColor = this._activePlayerColor === PieceColor.WHITE ? 
            PieceColor.BLACK : PieceColor.WHITE;
    }

    /** Gets displayed rank from actual rank */
    public getDisplayedRank(rank: number): number {
        if(this.gameSettings.flipBoard)
            return this._activePlayerColor === PieceColor.WHITE ? rank : BOARD_DIMEN - rank - 1;
        return rank;
    }

    /** Gets displayed timer */
    public getDisplayedTimer(timerIdx: PieceColor) {
        const playerColor = this.gameSettings.flipBoard 
            ? (timerIdx + this._activePlayerColor + 1) % 2
            : (timerIdx + 1) % 2;
        const minutes = Math.floor(this.secondsLeft[playerColor] / 60);
        const seconds = this.secondsLeft[playerColor] % 60;
        return `${minutes}:${seconds < 10 ? '0' + seconds.toString() : seconds}`;
    }

    /** Confirms dialog */
    public confirmDialog(): void {
        switch(this.confirmationDialogMode) {
            case EConfirmationDialogMode.RESIGN:
                this.resignGame();
                break;
            case EConfirmationDialogMode.DRAW:
                this.drawGame();
                break;
            case EConfirmationDialogMode.TAKEBACK:
                this.takeMoveBack();
                break;
            default:
                break;
        }
    }

    /** Gets confirmation dialog string */
    public getConfirmationDialogString(): string {
        switch(this.confirmationDialogMode) {
            case EConfirmationDialogMode.RESIGN:
                return 'Do you really want to resign?';
            case EConfirmationDialogMode.DRAW:
                return 'Does the other player want to draw?';
            case EConfirmationDialogMode.TAKEBACK:
                return 'Does the other player accept the takeback?';
            default:
                return '';
        }
    }

    /** Cancels dialog */
    public cancelDialog(): void {
        this.confirmationDialogMode = EConfirmationDialogMode.NONE;
    }

    /** Handles game end and sends the information about it via endGameEmitter */
    private _handleGameEnd(): void {
        const allPossibleMoves = this.board.generateAllPossibleMoves(this._activePlayerColor);
        if(allPossibleMoves.length === 0) {
            const isStalemate = isKingSafeOnBoard(this.board, this._activePlayerColor);
            this._passActivePlayerColors();
            const winner = isStalemate ? null : this._activePlayerColor;
            const reason = isStalemate ? EGameResultReason.STALEMATE : EGameResultReason.CHECKMATE;
            this.endGameEventEmitter.emit({
                winner,
                reason,
                boardState: this.board,
                gameSettings: this.gameSettings,
            });
        }
    }

    /** Triggers resignation */
    public resignGame(): void {
        this._passActivePlayerColors();
        this.endGameEventEmitter.emit({
            winner: this._activePlayerColor,
            reason: EGameResultReason.RESIGNATION,
            boardState: this.board,
            gameSettings: this.gameSettings
        });
    }

    /** Triggers draw */
    public drawGame(): void {
        this.endGameEventEmitter.emit({
            winner: null,
            reason: EGameResultReason.AGREEMENT,
            boardState: this.board,
            gameSettings: this.gameSettings
        });
    }

    /** Triggers takeback */
    public takeMoveBack(): void {
        
    }

    /** Loads game */
    public loadGame(target: HTMLInputElement): void {
        this.gameRepresentationManager.readFile(target, (result: any) => {
            const moveList = this.gameRepresentationManager.toMoveList(result);
            if(moveList && this.board.loadGame(moveList)) {
                this._initializeFields();
                this._activePlayerColor = moveList.length % 2;
            }
            target.value = '';
        });
    }

    /** Saves game */
    public saveGame(): void {

    }
}
