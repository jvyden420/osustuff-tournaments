import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CurrentGame {
  gameId: string;
  requestId: string;
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  public currentGame: BehaviorSubject<CurrentGame> = new BehaviorSubject(undefined);

  constructor(private apiService: ApiService) {
    this.checkCurrentGame();
  }

  private async checkCurrentGame() {
    const currentGame = this.getCurrentGame();

    if (currentGame) {
      try {
        const { verified }: any = await this.apiService
          .post(`check-verified`, {
            requestId: currentGame.requestId,
          })
          .toPromise();
        if (verified) {
          this.currentGame.next(currentGame);
        } else {
          this.clearCurrentGame();
        }
      } catch (e) {
        if ([404, 408].includes(e.status)) {
          this.clearCurrentGame();
        }
      }
    }
  }

  public setCurrentGame(gameId: string, requestId: string) {
    const currentGame = {
      gameId,
      requestId,
    };
    localStorage.setItem('currentGame', JSON.stringify(currentGame));

    this.currentGame.next(currentGame);
  }

  public clearCurrentGame() {
    localStorage.removeItem('currentGame');
    if (this.currentGame.getValue() !== undefined) {
      this.currentGame.next(undefined);
    }
  }

  private getCurrentGame(): CurrentGame | null {
    return JSON.parse(localStorage.getItem('currentGame') || 'null');
  }
}
