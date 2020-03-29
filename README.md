# covid19-casedata
Frontend for displaying COVID-19 case data for counties in Germany, #WirVsVirus hackathon

![](https://wirvsvirushackathon.org/wp-content/uploads/2020/03/12-scaled.jpg)

Demo: https://niklas-deutschmann.de/covid19/

## Run it yourself
* Set up Angular 9 [as described here](https://angular.io/guide/setup-local)
* Clone this project
* `npm install`
* `ng serve`

There is a Bash script for deploying the application using SCP. If you want to deploy to `http://myserver.com/covid19`
* Set the environment variable `CASEDATA_DEPLOY_HOST` to `myserver.com`
* Set the environment variable `CASEDATA_DEPLOY_USER` to your SSH username on this server
* Set the environment variable `CASEDATA_DEPLOY_DIR` to `covid19/`(trailing slash is important!)
* Run `ng build --prod --base-href /covid19 --deploy-url /covid19/ && npm run deploy_scp` (positions of slashes are important!)

## Related Projects

* [mojoaxel](https://github.com/mojoaxel): [covid19-risklayer-data](https://github.com/mojoaxel/covid19-risklayer-data), [DIVI-Intensivregister-data](https://github.com/mojoaxel/DIVI-Intensivregister-data) and [corona-data-germany](https://github.com/mojoaxel/corona-data-germany)
* [lobicolonia](https://github.com/lobicolonia/): [covid19-community-data](https://github.com/lobicolonia/covid19-community-data)
* [mkatenhusen](https://github.com/mkatenhusen): [covid-19-api-backend](https://github.com/mkatenhusen/covid-19-api-backend)

Take a look on our [project on DevPost](https://devpost.com/software/08_data-hub-de_regionale-daten-sharepics) to get more information about the project and the contributors.

## License
* GNU General Public License v3.0
