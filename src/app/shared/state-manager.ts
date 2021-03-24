import { Injectable } from '@angular/core';

import { IBoard } from '@app/shared/board/board-interface';
import { IGameSettings } from '@app/shared/game-settings'; 
import { IGameResults } from './game-results';
import { EGameState } from './game-state';
import { PieceColor } from './piece/piece-color';
import { IMove } from './tile';

enum EStateKey {
  GAME_SETTINGS = 'GAME_SETTINGS',
  GAME_STATE = 'GAME_STATE',
  GAME_RESULTS = 'GAME_RESULTS',

  SECONDS_LEFT = 'SECONDS_LEFT',
  MOVE_LIST = 'MOVE_LIST',
  ACTIVE_PLAYER_COLOR = 'ACTIVE_PLAYER_COLOR'
}

@Injectable({
  providedIn: 'root'
})
export class StateManager {

  private _set(key: EStateKey, item: any): void {
    localStorage.setItem(key, JSON.stringify(item));
  }

  private _get(key: EStateKey): any {
    return JSON.parse(localStorage.getItem(key));
  }

  public resetGame(): void {
    this._set(EStateKey.SECONDS_LEFT, null);
    this._set(EStateKey.MOVE_LIST, null);
    this._set(EStateKey.ACTIVE_PLAYER_COLOR, null);
  }

  public set gameSettings(item: IGameSettings) { this._set(EStateKey.GAME_SETTINGS, item); }
  public set gameState(item: EGameState) { this._set(EStateKey.GAME_STATE, item); }
  public set gameResults(item: IGameResults) { this._set(EStateKey.GAME_RESULTS, item)}
  public set secondsLeft(item: number[]) { this._set(EStateKey.SECONDS_LEFT, item); }
  public set moveList(item: IMove[]) { this._set(EStateKey.MOVE_LIST, item); }
  public set activePlayerColor(item: PieceColor) { this._set(EStateKey.ACTIVE_PLAYER_COLOR, item); }

  public get gameSettings(): IGameSettings { return this._get(EStateKey.GAME_SETTINGS) as IGameSettings; }
  public get gameState(): EGameState { return this._get(EStateKey.GAME_STATE) as EGameState; }
  public get gameResults(): IGameResults { return this._get(EStateKey.GAME_RESULTS) as IGameResults; }
  public get secondsLeft(): number[] { return this._get(EStateKey.SECONDS_LEFT) as number[]; }
  public get moveList(): IMove[] { return this._get(EStateKey.MOVE_LIST) as IMove[]; }
  public get activePlayerColor(): PieceColor { return this._get(EStateKey.ACTIVE_PLAYER_COLOR) as PieceColor; }
}
