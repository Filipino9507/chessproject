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
    public activePlayerColor: PieceColor;

    private selectedTile: ITile;
    private selectedTilePossibilities: ICoordinates[];

    @Input() public gameSettings: IGameSettings;

    public constructor() { }

    public ngOnInit(): void {
        this.activePlayerColor = PieceColor.WHITE;
        this.selectedTile = null;
        this.selectedTilePossibilities = null;
        this.board = new Board();
        this.initializeTimer();
    }

    public initializeTimer(): void {
        this.secondsLeft = new Array(2);
        this.secondsLeft.fill(this.gameSettings.secondsToThink);
        setInterval(_ => {
        --this.secondsLeft[this.activePlayerColor];
        if(this.secondsLeft[this.activePlayerColor] <= 0) {
            // EMIT SIGNAL TO END THE GAME
            clearInterval();
        }
        }, 1000);
    }

    public clickTile(coords: ICoordinates): void {
        const fromTile = this.board.getTile(coords);

        if(this.selectedTile == null) {

            if(fromTile.piece != null && fromTile.piece.color === this.activePlayerColor) {
                this.selectedTile = fromTile;
                this.selectedTilePossibilities = fromTile.piece.generatePossibleMoves(this.board, coords);
                // HIGHLIGHT SQUARES WHICH ARE THREATENED BY THIS
            }
            
        } else {

            const toTile = this.board.getTile(coords);
            const hasSameColorPiece = toTile.piece != null && 
                toTile.piece.color === this.activePlayerColor;

            if(Board.areCoordinatesInArray(coords, this.selectedTilePossibilities) && !hasSameColorPiece) {
                this.board.movePiece(this.selectedTile.coords, coords);
                this.board.updatePossibleMoves();
                this.passTurn();
            }
            this.selectedTile = null;
            this.selectedTilePossibilities = null;

            // CHECK IF SQUARE IS THREATENED BY THIS AND THAT A PIECE OF SAME COLOR NOT HERE
            // (NEED TO MIND THAT LATER IN PIECE LOGIC, E.G. BISHOP LOGIC)
        }
    }

    // Temporary to test opposite side, later will change
    private passTurn(): void {
        this.activePlayerColor = this.activePlayerColor === PieceColor.WHITE ? 
            PieceColor.BLACK : PieceColor.WHITE;
    }

}
