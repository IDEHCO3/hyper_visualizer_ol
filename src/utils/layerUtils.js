import axios from 'axios'
import { LayerResource, OptionsLayer } from './options'

export async function loadLayer(url) {
	let layer = new LayerResource();
  try {
    const resp_get = await axios.get(url);
		layer.json = resp_get.data;
		layer.url = url;
		layer.options_layer = [];
		const resp_options = await axios.options(url);
		layer.options_response =  new OptionsLayer( resp_options.data['hydra:supportedProperties'], resp_options.data['hydra:supportedOperations'], resp_options.data['@context'], resp_options.data['hydra:iriTemplate']);
		return layer;
  } catch (error) {
    console.error(error);
		return layer;
  }
}

export function onEachFeature (feature) {
  let result = '<div id="popup-close">X</div>'
  for (const [property_name, property_value] of Object.entries(feature)) {
  	if (property_name !== 'geometry')
    result += "<p>" + property_name + ": " + property_value + "</p>"
  }
  return result
}
