const geolib = require('geolib');

function findCoordinates(zipcode, zipcodes) {
  let zipObj = zipcodes.find(obj => obj.Zipcode === zipcode)
  if (zipObj) {
    return {
      latitude: zipObj.Lat,
      longitude: zipObj.Long
    }
  }
  console.error('Zipcode does not exist in zipcodes:', zipcode)
}

function findNear(center, radius, zipcodes) {
  const matches = [];

  zipcodes.forEach((zipInfo) => {
    const distance = geolib.getDistance(center, { latitude: zipInfo.Lat, longitude: zipInfo.Long })
    if (distance <= radius) {
      matches.push(zipInfo.Zipcode);
    }
  })
  return matches
}

module.exports = {
  near(origin, distance, zipcodes) {
    const coordinates = findCoordinates(origin, zipcodes)
    if (coordinates !== undefined) {
      return findNear(coordinates, distance, zipcodes)
    }
    return []
  }
}
