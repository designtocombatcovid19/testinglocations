const geolib = require('geolib');

function findCoordinates(zipcode, zipcodes, columns) {
  console.log('ZIPPY:', zipcode)
  let zipObj = zipcodes.find(obj => obj.Zipcode === zipcode)
  if (zipObj) {
    return {
      latitude: zipObj.Lat,
      longitude: zipObj.Long
    }
  }
  console.error('Zipcode does not exist in zipcodes:', zipcode)
}

// const nearbyZips = findNear(coordinates, distance, zipcodes, columns)
function findNear(center, radius, zipcodes, columns) {
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
    const columns = {
      long: 'Long',
      lat: 'Lat',
      zipcode: 'Zipcode',
    }
    const coordinates = findCoordinates(origin, zipcodes, columns)
    if (coordinates !== undefined) {
      return findNear(coordinates, distance, zipcodes, columns)
    }
    return []
  }
}
