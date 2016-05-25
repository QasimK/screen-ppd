# Screen-PPD

Use a screen's size and resolution combined with your viewing distance
(from your eyes to the screen) to calculate the Pixels Per Degree (PPD).

[Go to the calculator](https://qasimk.github.io/screen-ppd/screen-ppd/)


## Development Setup

Install requirements:

- (System) install node & [npm](https://www.npmjs.com/).
- Install dependencies inside `<project root>` with `npm install`.

Lint:

    npm run lint
    # TODO watch & CI
    npm run lint:watch

Test (TODO: There are currently no user-interface tests)

    npm run test
    npm run test:watch

Build:

    // Webserver @ http://localhost:8080/webpack-dev-server/
    npm run start
    // Production build
    npm run build
    // Dev build
    npm run build:dev
    // Dev watch
    npm run watch:dev


## References

- <https://google-webfonts-helper.herokuapp.com/fonts/open-sans?subsets=latin>
