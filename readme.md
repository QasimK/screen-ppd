# Screen-PPD

Hosted @ <https://qasimk.github.io/screen-ppd/>

Use a screen's size and resolution combined with your viewing distance (from your eyes to the screen) to calculate the Pixels Per Degree (PPD).

This single-page web-app uses Webpack, Standard, ES6/jQuery, and SASS.


## Development guide

Install requirements:

- (System) install node & [npm](https://www.npmjs.com/).
- Install dependencies inside `<project root>` with `npm install`.

Development:

    # Linting
    npm run lint

    # Hot-reload development web-server
    $ npm run start

    # Dev build
    $ npm run build:dev

Deployment (<https://qasimk.github.io/screen-ppd/>):

    $ npm run build
    # Note this will deploy the `dist/` folder of `origin/master`
    $ npm run deploy

All make commands are available in `package.json`.


### TODOs

* Remove jQuery dependency (it is not necessary anymore)
* Upgrade to minified Foundation 6+ (current CSS file is very large)
* Use normalize.js from NPM (see mvtemp branch on github)


## References

- <https://google-webfonts-helper.herokuapp.com/fonts/open-sans?subsets=latin>
