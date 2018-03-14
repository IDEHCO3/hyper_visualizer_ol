<template>
  <v-app dark id="inspire">
  <hv-nav @urlEntered="addLayer" @addOperation="addOperationLayer" :layers="layers" @zoom="zoomToLayer"></hv-nav>
    <div id="map"></div>
  </v-app>
</template>

<script>
// http://172.30.10.86/ibge/bcim/
import axios from 'axios'
import ol from 'openlayers'
import { loadLayer } from '../utils/layerUtils.js'

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
      //if (!this.alreadyIncluded(url)) {
        loadLayer(url).then(layerResource => {
          let gjson_format = new ol.format.GeoJSON().readFeatures(layerResource.json, {featureProjection: this.map.getView().getProjection()}) ;
          let vectorSource = new ol.source.Vector({features: gjson_format});
          let vectorLayer = new ol.layer.Vector({ source: vectorSource });
          this.map.addLayer(vectorLayer);
          layerResource.vector_layer = vectorLayer
          this.layers.push(layerResource);

        })
      //}
    },
    addOperationLayer (layer, url, operation) {
      const layerIndex = this.layers.indexOf(layer);
      console.log("entrei em addoperationLayer");
      axios.get(url).then(res => {
        const vectorSource = new ol.source.Vector({ features: new ol.format.GeoJSON().readFeatures(res.data, {featureProjection: this.map.getView().getProjection()})
        })
        const vectorLayer = new ol.layer.Vector({ source: vectorSource })
        layer.vectorLayer = vectorLayer;
        this.layers[layerIndex].optionsLayer.push({vectorLayer, operation})
        this.map.addLayer(vectorLayer)
      })
    },
    alreadyIncluded (url) {
      return this.layers.some(layer => layer.url === url)
    },

    zoomToLayer (layerResource) {
      let extent = layerResource.vector_layer.getSource().getExtent();
      this.map.getView().fit(extent, this.map.getSize());
    }
  },
  mounted () {
  	this.map = new ol.Map({ target: 'map'});
    let view = new ol.View({ center: [-4331024.58685793, -1976355.8033415168], zoom: 4 } );
    let a_source = new ol.source.OSM();
    let a_layer = new ol.layer.Tile({source: a_source})
    this.map.setView(view);
    this.map.addLayer(a_layer);
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
