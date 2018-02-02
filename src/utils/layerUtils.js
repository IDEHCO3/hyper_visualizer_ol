import axios from 'axios'
import { Layer, OptionsLayer } from './options'

export const loadLayer = (url) => 
	axios.all([axios.get(url), axios.options(url)])
		.then(axios.spread((getRes, optionRes) => {
		  const vector = new Layer({
		  	json: getRes.data,
		  	url: url,
		  	optionsResponse: new OptionsLayer(
	        optionRes.data['hydra:supportedProperties'],
	        optionRes.data['hydra:supportedOperations'],
	        optionRes.data['@context'],
	        optionRes.data['hydra:iriTemplate']
	      ),
	  		optionsLayer: []
		  })
		  return vector
		 })
		)
