import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IGameSettings } from '@app/shared/game-settings';
import { Board } from '@app/shared/board';
import { areCoordinatesInArray, BOARD_DIMEN } from '@app/shared/board-utility';
import { ITile, ICoordinates } from '@app/shared/tile';
import { PieceColor } from '@app/shared/piece/piece-color';
import { IGameResults } from '@app/shared/game-results';
import { EGameResultReason } from '@app/shared/game-result-reason';
import { GameRepresentationManager } from '@app/shared/game-representation-manager';
import { StateManager } from '@app/shared/state-manager';
import { Piece } from '@app/shared/piece/piece';


enum EConfirmationDialogMode { NONE, RESIGN, DRAW, TAKEBACK }

/**
 * Board component
 * Holds the board object, remaining time data, and data necessary for UI to function.
 */
@Component({
    selector: 'app-play-board',
    template: `
        <div class="container-h">
            <nb-card>
                <nb-card-body id="board-container" class="container-v">
                    <div class="container-h" *ngFor="let _ of board.tileArray; let _rank = index; let evenRank = even">
                        <div class="container-h" *ngVar="getDisplayedRankOrFile(_rank) as rank">
                            <div *ngFor="let _ of board.tileArray[rank]; let _file = index; let evenFile = even">
                                <button 
                                    *ngVar="getDisplayedRankOrFile(_file) as file"
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
                    </div>
                </nb-card-body>
            </nb-card>
            <nb-card>
                <nb-card-body id="side-container">
                    <h3 class="timer"> Time left: {{ getDisplayedTimer(0) }} </h3>
                    <nb-card status="primary">
                        <nb-card-header>Game controls</nb-card-header>
                        <nb-card-body class="container-v" *ngIf="confirmationDialogMode === EConfirmationDialogMode.NONE">
                            <button 
                                class="game-control" 
                                nbButton
                                size="small" 
                                status="primary"
                                (click)="confirmationDialogMode = EConfirmationDialogMode.RESIGN">
                                Resign
                            </button>
                            <button 
                                class="game-control" 
                                nbButton 
                                size="small" 
                                status="primary"
                                (click)="confirmationDialogMode = EConfirmationDialogMode.DRAW">
                                Offer draw
                            </button>
                            <button 
                                class="game-control" 
                                nbButton 
                                size="small" 
                                status="primary"
                                (click)="confirmationDialogMode = EConfirmationDialogMode.TAKEBACK">
                                Propose takeback
                            </button>
                        </nb-card-body>
                        <nb-card-body class="container-v" *ngIf="confirmationDialogMode !== EConfirmationDialogMode.NONE">
                            <p>{{ getDisplayedConfirmationDialogString() }}</p>
                            <button 
                                class="game-control" 
                                nbButton
                                size="small" 
                                status="primary"
                                (click)="confirmDialog()">
                                Yes
                            </button>
                            <button 
                                class="game-control" 
                                nbButton
                                size="small" 
                                status="primary"
                                (click)="cancelDialog()">
                                No
                            </button>
                        </nb-card-body>

                        <nb-card-body>
                            <textarea
                                id="game-representation"
                                nbInput
                                readonly
                                [innerHTML]="getDisplayedGameRepresentation()">
                                Hello world
                            </textarea>
                        </nb-card-body>

                        <nb-card-body class="container-v">
                            <input
                                #self
                                hidden
                                type="file"
                                (change)="loadGame(self)" />

                            <button
                                class="game-control"
                                nbButton
                                size="small"
                                (click)="self.click()">
                                Load game
                            </button>
                            <button
                                class="game-control"
                                nbButton
                                size="small"
                                (click)="saveGame()">
                                Save game
                            </button>
                        </nb-card-body>
                    </nb-card>
                    <h3 class="timer">Time left: {{ getDisplayedTimer(1) }} </h3>
                </nb-card-body>
            </nb-card> 
        </div>
    `,
    styles: [
        `#side-container {
            margin: 0 auto;
            padding: 10px;
        }
        #board-container {
            margin: 0 auto;
        }
        .timer {
            display: flex;
            justify-content: center;
            align-items: center;
            flex: 1;
            font-size: 20px;
        }
        button.game-control {
            margin: 5px;
        }`,

        `button.tile {
            min-width: 75px;
            min-height: 75px;
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
        }
        #game-representation {
            resize: none;
            min-height: 135px;
        }`
    ]
})
export class PlayBoardComponent implements OnInit {

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
    public constructor(
      public gameRepresentationManager: GameRepresentationManager,
      private _stateManager: StateManager
    ) { }

    /** On init */
    public ngOnInit(): void {
        this._initializeFields();
        this.board = new Board();
        this._initializeTimer();
				this._initializeStoredFields();
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
						this._stateManager.secondsLeft = this.secondsLeft;
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

		/** Initializes the stored values, if there are any */
		private _initializeStoredFields(): void {
			const storedSecondsLeft = this._stateManager.secondsLeft;
			const storedMoveList = this._stateManager.moveList;
			const storedActivePlayerColor = this._stateManager.activePlayerColor;
			
			if(storedSecondsLeft)
				this.secondsLeft = storedSecondsLeft;
			if(storedMoveList)
				this.board.loadGame(storedMoveList);
			if(storedActivePlayerColor)
				this._activePlayerColor = storedActivePlayerColor;
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
            const piece = this._selectedTile.piece;
            const mv = piece.move(this.board, coords);
            this.board.playedMoves.push(mv);
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

				this._stateManager.moveList = this.board.playedMoves;
				this._stateManager.activePlayerColor = this._activePlayerColor;
    }

    /** Changes active player color to the opposite */
    private _passActivePlayerColors(): void {
        this._activePlayerColor = this._activePlayerColor === PieceColor.WHITE ? 
            PieceColor.BLACK : PieceColor.WHITE;
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

    /** Cancels dialog */
    public cancelDialog(): void {
        this.confirmationDialogMode = EConfirmationDialogMode.NONE;
    }

    /** Handles game end and sends the information about it via endGameEmitter */
    private _handleGameEnd(): void {
        const allPossibleMoves = this.board.generateAllPossibleMoves(this._activePlayerColor);
        if(allPossibleMoves.length === 0) {
            const isStalemate = this.board.isKingSafe(this._activePlayerColor);
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
        this.board.takeMoveBack();
        this._selectedTile = null;
        this._selectedTilePossibilities = null;
        this.confirmationDialogMode = EConfirmationDialogMode.NONE;
        this._activePlayerColor = this.board.moveCount % 2;
    }

    /** Loads game */
    public loadGame(target: HTMLInputElement): void {
        this.gameRepresentationManager.readFile(target, (result: any) => {
            const moveList = this.gameRepresentationManager.toMoveList(result);
            if(moveList && this.board.loadGame(moveList)) {
                this._initializeFields();
                this._activePlayerColor = moveList.length % 2;
            } else
                alert('Failed loading game.')
            target.value = '';
        });
    }

    /** Saves game */
    public saveGame(): void {
        const representation = this.gameRepresentationManager.toRepresentation(this.board.playedMoves);
        this.gameRepresentationManager.writeFile(representation, 'game.txt');
    }

    /** Gets displayed rank from actual rank, or file respectively */
    public getDisplayedRankOrFile(rankOrFile: number): number {
        if(this.gameSettings.flipBoard)
            return this._activePlayerColor === PieceColor.WHITE ? rankOrFile : BOARD_DIMEN - rankOrFile - 1;
        return rankOrFile;
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

    /** Gets confirmation dialog string */
    public getDisplayedConfirmationDialogString(): string {
        switch(this.confirmationDialogMode) {
            case EConfirmationDialogMode.RESIGN:
                return 'Do you really want to resign?';
            case EConfirmationDialogMode.DRAW:
                return 'Does the opponent agree to draw?';
            case EConfirmationDialogMode.TAKEBACK:
                return 'Does the opponent accept the takeback?';
            default:
                return '';
        }
    }

    /** Gets displayed game representat5ion string */
    public getDisplayedGameRepresentation(): string {
        return this.gameRepresentationManager.toHumanRepresentation(this.board);
    }
}
