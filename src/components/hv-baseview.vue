<template>
  <v-app dark id="inspire">
    <hv-nav @urlEntered="addLayer" @addOperation="addOperationLayer" :layers="layers" @removeLayer="removeLayer" @zoom="zoomToLayer"></hv-nav>
    <div id="popup" ref="popup"></div>
    <div id="map"></div>
  </v-app>
</template>

<script>
// http://172.30.10.86/ibge/bcim/
import axios from 'axios'
import ol from 'openlayers'
import { loadLayer, onEachFeature } from '../utils/layerUtils.js'

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
      loadLayer(url).then(layer_resource => {
        let gjson_format = new ol.format.GeoJSON().readFeatures(layer_resource.json, {featureProjection: this.map.getView().getProjection()}) ;
        let vector_source = new ol.source.Vector({features: gjson_format});
        let vector_layer = new ol.layer.Vector({ source: vector_source });
        this.map.addLayer(vector_layer);
        layer_resource.vector_layer = vector_layer
        this.layers.push(layer_resource);
      })
    },
    addOperationLayer (layer, url, operation) {
      const layerIndex = this.layers.indexOf(layer);
      console.log("entrei em addoperationLayer");
      axios.get(url).then(res => {
        const vector_source = new ol.source.Vector({ features: new ol.format.GeoJSON().readFeatures(res.data, {featureProjection: this.map.getView().getProjection()})
        })
        const vector_layer = new ol.layer.Vector({ source: vector_source })
        layer.vector_layer = vector_layer;
        this.layers[layerIndex].options_layer.push({vector_layer, operation})
        this.map.addLayer(vector_layer)
      })
    },
    alreadyIncluded (url) {
      return this.layers.some(layer => layer.url === url)
    },
    popup (evt) {
      const map = this.map
      const popup = new ol.Overlay({ element: this.$refs.popup })
      const popupElement = this.$refs.popup
      const select =  new ol.interaction.Select()

      map.addInteraction(select)

      select.on('select', function(e) {
        map.removeInteraction(select)
        const layer_properties = e.selected[0].getProperties()
        popup.setPosition(evt.coordinate)
        map.addOverlay(popup)
        popupElement.innerHTML = onEachFeature(layer_properties)
        popupElement.firstElementChild.addEventListener('click', () => popup.setPosition(undefined))
      })
    },
    removeLayer (layer, index) {
      this.map.removeLayer(layer.vector_layer)
      this.layers.splice(index, 1)
    },
    zoomToLayer (layer_resource) {
      let extent = layer_resource.vector_layer.getSource().getExtent();
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
    this.map.on('singleclick', evt => this.popup(evt))
 }
}
</script>

<style>
  #map {
    height: 100%;
    width: 100%;
    position: absolute;
    bottom: 0;
    z-index: 0;
  }
  #popup {
    color: #000;
    position: absolute;
    background-color: white;
    -webkit-filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
    filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
    padding: 5px;
    padding-top: 15px;
    border-radius: 10px;
    border: 1px solid #cccccc;
    bottom: 12px;
    left: -50px;
    min-width: 280px;
  }
  #popup-close {
    position: absolute;
    color: #F44;
    content: 'X';
    height: 20px;
    width: 20px;
    top: 5px;
    right: 10px;
    cursor: pointer;
  }
</style>
