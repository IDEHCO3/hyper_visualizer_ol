import axios from 'axios'
import ol from 'openlayers'
import { LayerResource, OptionsLayer } from './options'


export async function loadImageLayer (url) {
  const coordinates = await axios.get(`${url}envelope/transform/3857&true`)
  const extent = coordinates.data.coordinates[0][0].concat(coordinates.data.coordinates[0][2])
  return new ol.layer.Image({
    source: new ol.source.ImageStatic({
      url: `${url}.png`,
      crossOrigin: '',
      projection: 'EPSG:3857',
      imageExtent: extent
    })
  })
}

export async function loadVectorLayer (url, projection, operation_name) {
	let layer = new LayerResource()
  const resp_get = await axios.get(url)
  try {
    const resp_options = await axios.options(url)
    layer.options_response =  new OptionsLayer( resp_options.data['hydra:supportedProperties'], resp_options.data['hydra:supportedOperations'], resp_options.data['@context'], resp_options.data['hydra:iriTemplate'])
  }
  catch(err) {
    console.log('Sem resposta no OPTIONS', err)
  }
  const gjson_format = new ol.format.GeoJSON().readFeatures(resp_get.data, {featureProjection: projection})
  const vector_source = new ol.source.Vector({features: gjson_format})

  layer.json = resp_get.data
  layer.url = url
  layer.options_layer = []
  layer.vector_layer = new ol.layer.Vector({ source: vector_source })
  if (operation_name) {
    layer.operationName = operation_name
  }
	return layer
}

export function onEachFeature (feature) {
  let result = '<div id="popup-close">X</div>'
  for (const [property_name, property_value] of Object.entries(feature)) {
  	if (property_name !== 'geometry')
    result += "<p>" + property_name + ": " + property_value + "</p>"
  }
  return result
}
