# Screen-PPD

Use a screen's size and resolution combined with your viewing distance
(from your eyes to the screen) to calculate the Pixels Per Degree (PPD).

The calculator is not currently hosted; a pre webpack-redesign (using straightforward CSS/Foundation, JS/jQuery) can be seen with [this commit](https://github.com/QasimK/screen-ppd/tree/fdd6071737a1f33a12142ffdc788d0b9f6e81a95).


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
