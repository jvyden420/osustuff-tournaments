import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameLobbyComponent } from './components/game-lobby/game-lobby.component';
import { ApiService } from './services/api.service';
import { GameInfoComponent } from './components/game-lobby/game-info/game-info.component';
import { BeatmapInfoComponent } from './components/game-lobby/beatmap-info/beatmap-info.component';
import { ScoresListComponent } from './components/game-lobby/scores-list/scores-list.component';
import { UserListComponent } from './components/game-lobby/user-list/user-list.component';
import { ChatComponent } from './components/game-lobby/chat/chat.component';
import { LobbiesListComponent } from './components/lobbies-list/lobbies-list.component';
import { JoinGameComponent } from './components/game-lobby/join-game/join-game.component';
import { SettingsService } from './services/settings.service';
import { BeatmapListComponent } from './components/game-lobby/beatmap-list/beatmap-list.component';
import { GameStatusComponent } from './components/game-lobby/game-status/game-status.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojifyModule } from 'angular-emojify';
import {
  LazyLoadImageModule,
  intersectionObserverPreset
} from 'ng-lazyload-image';
import { ScoresTableComponent } from './components/game-lobby/scores-list/scores-table/scores-table.component';
import { OrdinalPipe } from './pipes/ordinal.pipe';
import { MenuComponent } from './components/game-lobby/menu/menu.component';

@NgModule({
  declarations: [
    OrdinalPipe,
    AppComponent,
    GameLobbyComponent,
    GameInfoComponent,
    BeatmapInfoComponent,
    ScoresListComponent,
    UserListComponent,
    ChatComponent,
    LobbiesListComponent,
    JoinGameComponent,
    BeatmapListComponent,
    GameStatusComponent,
    ScoresTableComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    PickerModule,
    EmojifyModule,
    LazyLoadImageModule.forRoot({
      preset: intersectionObserverPreset
    })
  ],
  providers: [ApiService, SettingsService],
  bootstrap: [AppComponent]
})
export class AppModule {}
