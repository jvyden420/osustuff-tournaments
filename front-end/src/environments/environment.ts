// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  base_api_url: 'https://play.osustuff.org/api/',
  osu_redirect_url: 'https://play.osustuff.org/api/login-verify',
  osu_oauth_id: '48',
  twitch_redirect_url: 'https://play.osustuff.org/api/twitch-redirect',
  twitch_client_id: 'le90ws5nsckurdggyl8geafm3uxb8w',
  socket_url: 'https://play.osustuff.org:2053',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
