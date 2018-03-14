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
