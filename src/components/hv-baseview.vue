<template>
  <v-app dark id="inspire">
    <hv-nav @addOperation="addLayer" @entryPoint="entryPoint" @removeLayer="removeLayer" @urlEntered="addLayer" @zoom="zoomToLayer" :layers="layers" @switchBaseLayer="switchBaseLayer"></hv-nav>
    <div id="popup" ref="popup"></div>
    <div id="map"></div>
  </v-app>
</template>

<script>
// http://172.30.10.86/ibge/bcim/
import axios from 'axios'
import ol from 'openlayers'
import { loadImageLayer, loadVectorLayer, onEachFeature } from '../utils/layerUtils.js'
import baseLayer from '../utils/baseLayers.js'
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
    async addLayer (renderMode, url, operation_name) {
      if (!this.alreadyIncluded(url)) {
        if (renderMode === 'image') {
          const imageLayer = await loadImageLayer(url)
          this.map.addLayer(imageLayer)
        }
        if (renderMode === 'vector') {
          const vectorLayer = await loadVectorLayer(url, this.map.getView().getProjection(), operation_name)
          this.layers.unshift(vectorLayer)
          this.map.addLayer(vectorLayer.vector_layer)
        }
      }
    },
    alreadyIncluded (url) {
      return this.layers.some(layer => layer.url === url)
    },
    async entryPoint (url) {
      const entryPoint = await axios.get(url)
      Object.entries(entryPoint.data).map((key) => {
        const layer = {operationName: key[0], url: key[1]}
        this.layers.push(layer)
      })
    },
    switchBaseLayer (base, oldBase) {
      this.map.removeLayer(baseLayer(oldBase))
      if (base !== 'nenhuma') this.map.addLayer(baseLayer(base))
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
      let extent = layer_resource.vector_layer.getSource().getExtent()
      this.map.getView().fit(extent, this.map.getSize())
    }
  },
  mounted () {
  	this.map = new ol.Map({ target: 'map'})
    const view = new ol.View({ center: [-4331024.58685793, -1976355.8033415168], zoom: 4 })
    this.map.setView(view)
    this.map.addLayer(baseLayer('OSM'))
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
