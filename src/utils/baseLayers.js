import ol from 'openlayers'

const layers = {
  OSM: new ol.layer.Tile({source: new ol.source.OSM(), zIndex: 0}),
  google: new ol.layer.Tile({source: new ol.source.OSM({url: 'http://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'}), zIndex: 0}),
  satelite: new ol.layer.Tile({source: new ol.source.OSM({url: 'http://khm{0-3}.googleapis.com/kh?v=742&hl=pl&&x={x}&y={y}&z={z}'}), zIndex: 0}),
  watercolor: new ol.layer.Tile({source: new ol.source.OSM({url: 'http://{a-c}.tile.stamen.com/watercolor/{z}/{x}/{y}.png'}), zIndex: 0}),
  wikimedia: new ol.layer.Tile({source: new ol.source.OSM({url: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png'}), zIndex: 0})
}

export default (mapName) => layers[mapName]
