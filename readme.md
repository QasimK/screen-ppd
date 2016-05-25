# Screen-PPD

Hosted @ <https://qasimk.github.io/screen-ppd/>

Use a screen's size and resolution combined with your viewing distance (from your eyes to the screen) to calculate the Pixels Per Degree (PPD).

This single-page webapp uses Webpack, ES6/Babel/jQuery, and SASS.

(TODO: Remove jQuery dependency.)


## Development guide

Install requirements:

- (System) install node & [npm](https://www.npmjs.com/).
- Install dependencies inside `<project root>` with `npm install`.

Lint:

    npm run lint


Build:

    // Webserver @ http://localhost:8080/webpack-dev-server/
    npm run start
    // Production build
    npm run build
    // Dev build
    npm run build:dev
    // Dev watch
    npm run watch:dev

Restricted deploy to <https://qasimk.github.io/screen-ppd/>:
(Note this will deploy the `dist/` folder of `origin/master`)

    npm run deploy


## References

- <https://google-webfonts-helper.herokuapp.com/fonts/open-sans?subsets=latin>
