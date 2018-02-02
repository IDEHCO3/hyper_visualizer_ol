<template>
  <v-app dark id="inspire">
  <hv-nav @urlEntered="addLayer" :layers="layers"></hv-nav>
    <div id="map"></div>
  </v-app>
</template>

<script>
// http://172.30.10.86/ibge/bcim/
import axios from 'axios'
import ol from 'openlayers'
import { loadLayer } from '../utils/layerUtils.js'
import { vectorSource } from '../utils/onTheFly.js'
import HvNav from './hv-nav'

export default {
  name: 'hv-baseview',
  components: { HvNav },
  data () {
    return {
      map: null,
      layers: []
    }
  },
  methods: {
    addLayer (url) {
      if (!this.alreadyIncluded(url)) {
        loadLayer(url).then(res => {
          const layer = res
          layer.vectorLayer = vectorSource(res.json)
          this.layers.push(layer)
          this.map.addLayer(layer.vectorLayer)
        })
      }
    },
    
    alreadyIncluded (url) {
      return this.layers.some(layer => layer.url === url)
    }
  },
  mounted () {
  	this.map = new ol.Map({
		  view: new ol.View({
		    center: [-5331024.58685793, -1976355.8033415168],
		    zoom: 3
		  }),
		  layers: [
		    new ol.layer.Tile({
		      source: new ol.source.OSM()
		    })
		  ],
		  target: 'map'
		})
  }
}
</script>

<style scoped>
  #map { 
    height: 100%;
    width: 100%;
    position: absolute;
    bottom: 0;
    z-index: 0;
  }
</style>
