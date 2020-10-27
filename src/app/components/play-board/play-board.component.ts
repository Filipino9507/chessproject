import { Component, OnInit } from '@angular/core';

import { Piece, PieceType, PieceColor } from '@app/shared/piece';

@Component({
  selector: 'app-play-board',
  templateUrl: './play-board.component.html',
  styleUrls: ['./play-board.component.scss']
})
export class PlayBoardComponent implements OnInit {

  public static readonly boardDimen = 8;

  public boardArray: Piece[][];

  constructor() { }

  ngOnInit(): void {
    this.boardArray = Array(PlayBoardComponent.boardDimen)
    .fill(Array(PlayBoardComponent.boardDimen)
    .fill(Piece.NONE));
  }

}
