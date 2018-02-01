import ol from 'openlayers'
import geojsonVT from 'geojson-vt'

export const vectorSource = (layerJSON) => {
  const vector = new ol.source.VectorTile({
    format: new ol.format.GeoJSON(),
    tileLoadFunction (tile) {
      const format = tile.getFormat()
      const tileCoord = tile.getTileCoord()
      const data = tileIndex(layerJSON).getTile(tileCoord[0], tileCoord[1], -tileCoord[2] - 1)
      const features = format.readFeatures(
          JSON.stringify({
            type: 'FeatureCollection',
            features: data ? data.features : []
          }, replacer))
      tile.setLoader(function() {
        tile.setFeatures(features)
        tile.setProjection(tilePixels)
      })
    },
    url: 'data:' // arbitrary url, we don't use it in the tileLoadFunction
  })
  return new ol.layer.VectorTile({ source: vector })
}

const replacer = function(key, value) {
  if (value.geometry) {
    let type;
    let rawType = value.type;
    let geometry = value.geometry;
    if (rawType === 1) {
      type = 'MultiPoint';
      if (geometry.length == 1) {
        type = 'Point';
        geometry = geometry[0];
      }
    } else if (rawType === 2) {
      type = 'MultiLineString';
      if (geometry.length == 1) {
        type = 'LineString';
        geometry = geometry[0];
      }
    } else if (rawType === 3) {
      type = 'Polygon';
      if (geometry.length > 1) {
        type = 'MultiPolygon';
        geometry = [geometry];
      }
    }
    return {
      'type': 'Feature',
      'geometry': {
        'type': type,
        'coordinates': geometry
      },
      'properties': value.tags
    };
  } else {
    return value;
  }
}

const tileIndex = layerJSON => geojsonVT(layerJSON, { extent: 4096, debug: 1 })

const tilePixels = new ol.proj.Projection({ code: 'TILE_PIXELS', units: 'tile-pixels' })
