<template>
  <v-app dark id="inspire">
    <v-navigation-drawer persistent clipped enable-resize-watcher v-model="drawer" app>

    </v-navigation-drawer>
    <v-toolbar class="cyan" fixed clipped-left app>
      <v-toolbar-title >
        <v-toolbar-side-icon @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <input type="text" v-model="urlSearch" placeholder="Enter URL here..." @keyup.enter="addLayer"> </input>
      <v-btn icon @click.native="addLayer">
        <v-icon>search</v-icon>
      </v-btn>
    </v-toolbar>

    <div id="map"></div>
  </v-app>
</template>

<script>
// http://172.30.10.86/ibge/bcim/
import axios from 'axios'
import ol from 'openlayers'
import { loadLayer } from '../utils/layerUtils.js'
import { vectorSource } from '../utils/onTheFly.js'

export default {
  name: 'hv-baseview',
  data () {
    return {
      drawer: false,
      urlSearch: '',
      map: null,
      layers: []
    }
  },
  methods: {
    addLayer () {
      if (!this.alreadyIncluded()) {
        loadLayer(this.urlSearch).then(res => {
          const layer = res
          layer.vector_layer = vectorSource(res.json)
          this.layers.push(layer)
          this.map.addLayer(layer.vector_layer)
        })
        this.urlSearch = ''
      }
    },
    
    alreadyIncluded () {
      this.urlSearch.endsWith('/') ? this.urlSearch : `${this.urlSearch}/`
      return this.layers.some(layer => layer.url === this.urlSearch)
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
  #e3, #e3 .container {
    min-height: 700px;
    overflow: hidden;
    z-index: 0;
  }
  #e3 .input-group__details:after {
    background-color: rgba(255,255,255,0.32) !important;
  }

  #e3 .input-group--focused .input-group__append-icon {
    color: inherit !important;
  }
  input[type=text] {
    width: 50%;
    margin-left: 5px;
    padding: 5px 5px 5px 5px;
    border: none;
    border-bottom: 1px solid white;
    outline: none;
    color: white;
}

input[type=text]:focus {
    border-bottom: 1px solid blue;
    color: white;

}
</style>
