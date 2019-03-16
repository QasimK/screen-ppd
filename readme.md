# Screen-PPD

Hosted @ <http://qasimk.io/screen-ppd/>

Use a screen's size and resolution combined with your viewing distance (from your eyes to the screen) to calculate the Pixels Per Degree (PPD).


## Development guide

Install requirements:

- (System) install node & [npm](https://www.npmjs.com/).
- Install dependencies inside `<project root>` with `npm install`.

Development:

    # Linting
    $ npm run lint

    # Hot-reloading development web-server
    $ npm run start

    # Dev build
    $ npm run build:dev

Deployment (<https://qasimk.github.io/screen-ppd/>):

    $ npm run build

    # Warning: the following will deploy the `dist/` folder of `origin/master`
    $ npm run deploy

All make commands are available in `package.json`.


### Dependencies

* WebPack
    * [Various Extras]
* Standard for linting and auto-formatting
    * Snazzy to nicely format lint output


### TODOs

* Remove jQuery dependency (it is not necessary any more)
* Fix link to PPI breaking when changing diagonal units
* Explain what PPD is
* Bandwidth requirement calculation
* Stretch: Permalinks
* Stretch: Database of Monitors


## References

- <https://google-webfonts-helper.herokuapp.com/fonts/open-sans?subsets=latin>
