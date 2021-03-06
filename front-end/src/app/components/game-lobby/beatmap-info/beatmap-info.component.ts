import { IGame } from './../game-lobby.component';
import { IBeatmap } from './../../create-lobby/create-lobby.component';
import { Component, OnInit, Input } from '@angular/core';
import { getTimeComponents } from 'src/app/resolvers/game-lobby.resolver';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-beatmap-info',
  templateUrl: './beatmap-info.component.html',
  styleUrls: ['./beatmap-info.component.scss'],
})
export class BeatmapInfoComponent implements OnInit {
  @Input() game;
  @Input() beatmap: IBeatmap;
  @Input() isAlive: boolean;
  @Input() timeLeft: string;
  @Input() hideTitle?: boolean;

  constructor(private sanitizer:DomSanitizer) {}

  ngOnInit() {}

  public getBgStyles() {
    return (
      this.beatmap && {
        background: `linear-gradient( rgba(0, 0, 0, 0.6),
            rgba(0, 0, 0, 0.7) ),
            url(https://assets.ppy.sh/beatmaps/${this.beatmap.beatmapset_id}/covers/card@2x.jpg)`,
      }
    );
  }

  get starRating() {
    return parseFloat(this.beatmap.difficultyrating).toFixed(2);
  }

  get beatmapHref() {
    return (
      this.beatmap &&
      `https://osu.ppy.sh/beatmapsets/${this.beatmap.beatmapset_id}#${getBeatmapHrefString(this.game.gameMode)}/${this.beatmap.beatmap_id}`
    );
  }

  get dlLink() {
    return (
      this.beatmap &&
      `https://osu.ppy.sh/beatmapsets/${this.beatmap.beatmapset_id}/download?noVideo=true`
    );
  }

  get osuDirectLink() {
    return (
      this.beatmap &&
      this.sanitizer.bypassSecurityTrustUrl(`osu://dl/${this.beatmap.beatmapset_id}`)
    );
  }

  get duration() {
    const millis = parseFloat(this.beatmap.total_length) * 1000;

    const { minutes, seconds } = getTimeComponents(millis);

    return `${minutes}:${seconds}`;
  }
}

export function getBeatmapHrefString(mode?: IGame['gameMode']): string {
  if (!mode) {
    return 'osu';
  }

  switch (mode) {
    case '0':
      return 'osu';
    case '1':
      return 'taiko';
    case '2':
      return 'fruits';
    case '3':
      return 'mania';
  }
}
