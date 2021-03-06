'use strict';

const checkArea = require('../top-airports/top-airports');
const bearerAuth = require('../lib/bearer-auth');
const lowfareSearch = require('../lib/amadeus-middleware').lowfareSearch;
const inspirationSearch = require('../lib/amadeus-middleware').inspirationSearch;


module.exports = function(router) {
  router.get('/lowfare-search', bearerAuth, lowfareSearch, (request, response) => {
    let flights = request.lowfare.results.map(flight => flight);
    response.status(200).json(flights);
  });

  router.get('/inspiration-search', bearerAuth, inspirationSearch, (request, response) => {
    let test = checkArea.checkAirport(request.inspiration.results, request.query.area);
    response.status(200).json(test);
  });
};
