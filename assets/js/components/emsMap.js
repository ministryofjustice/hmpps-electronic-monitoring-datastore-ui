import * as L from 'leaflet'

let map,
  markers = [],
  routes = []

const confidenceRadianceMeters = 10

function initMap() {
  map = L.map('map').setView([51.5074, -0.1278], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map)
}

function loadPlacesFromHTML() {
  const elements = document.querySelectorAll('.ems-routes tbody .govuk-table__row')

  routes = Array.from(elements).map(el => {
    const cells = el.querySelectorAll('.govuk-table__cell')

    const points = JSON.parse(cells[3].dataset.route)

    const route = {
      date: cells[0].dataset.date,
      timePeriod: cells[1].dataset.timePeriod,
      location: cells[2].dataset.location,
      start: {
        lat: parseFloat(points[0][0]),
        lon: parseFloat(points[0][1]),
      },
      points,
    }

    return route
  })
}

function updateMarkers(routeIndex) {
  markers.forEach(marker => marker.remove())
  markers = []

  const route = routes[routeIndex]
  const pointList = route.points.map(point => new L.LatLng(...point))

  const line = new L.polyline(pointList, {
    color: 'red',
    weight: 3,
    opacity: 0.5,
    smoothFactor: 1,
  }).addTo(map)
  markers.push(line)

  route.points.forEach((point, index) => {
    var circleMarker = L.circle([point[0], point[1]], {
      key: index,
      color: '#00703c',
      fillColor: '#00703c',
      fillOpacity: 0.6,
      radius: 2,
    })
      .bindPopup(`Location: ${point[0]}, ${point[1]}`)
      .addTo(map)

    var confidenceCircle = L.circle([point[0], point[1]], {
      key: index,
      color: '#00703c',
      fillColor: 'black',
      fillOpacity: 0.1,
      radius: confidenceRadianceMeters,
      weight: 2,
    }).addTo(map)

    markers.push(circleMarker)
    markers.push(confidenceCircle)
  })

  if (route.points.length) {
    const bounds = L.latLngBounds(route.points.map(p => [p[0], p[1]]))
    map.fitBounds(bounds, { padding: [50, 50] })
  }
}

function displayRouteHandler(event) {
  updateMarkers(this.dataset.index)
}

export function init() {
  if (!document.getElementById('map')) return

  initMap()
  loadPlacesFromHTML()
  updateMarkers(0)

  document
    .querySelectorAll('.govuk-table .route-select')
    .forEach($el => $el.addEventListener('click', displayRouteHandler))
}
