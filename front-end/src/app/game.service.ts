import { Injectable } from '@angular/core';
import { ApiService } from './services/api.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor(private apiService: ApiService) {}

  public async getLobbies() {
    return await this.apiService.get('lobbies').toPromise();
  }

  public async getLobby(id: string) {
    return await this.apiService.get(`lobbies/${id}`).toPromise();
  }

  public async getLobbyBeatmaps(id: string) {
    return await this.apiService.get(`lobbies/${id}/beatmaps`).toPromise();
  }

  public async getLobbyUsers(id: string) {
    return await this.apiService.get(`lobbies/${id}/users`).toPromise();
  }
}
