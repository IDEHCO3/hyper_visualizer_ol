<template>
<div>
  <v-navigation-drawer persistent clipped enable-resize-watcher v-model="drawer" app>

  <v-expansion-panel expand dense v-for="(layer, layerIndex) in layers" :key="layerIndex" class="mb-1">
    <v-expansion-panel-content v-if="layer.vector_layer">
      <div slot="header">{{ layer.operationName || layer.short_name() }}
        <v-tooltip right close-delay="2500">
          <v-btn slot="activator" dark icon><v-icon>info</v-icon></v-btn>
          <span>{{ layer.url }}</span>
        </v-tooltip>
      </div>
      <v-card>
        <v-card-actions>
          <v-switch :label="layer.vector_layer.getVisible() ? 'ATIVO' : 'INATIVO'" v-model="layer.vector_layer.getVisible()" @change="changeLayerVisibility(layer)" color="cyan"/></v-switch>
          <v-list-tile style="margin-top: -30px">
            <v-btn icon @click="removeLayer(layer, layerIndex)">
              <v-icon color="red accent-3">delete</v-icon>
            </v-btn>
          </v-list-tile>
          <v-btn icon @click.native="zoomToLayer(layer)" style="margin-top: -30px">
            <v-icon dark>zoom_in</v-icon>
          </v-btn>
          <v-menu offset-x :close-on-content-click="true" style="margin-top: -30px">
            <v-btn icon slot="activator" >
              <v-icon color="indigo accent-4">invert_colors</v-icon>
            </v-btn>
            <v-card dark >
              <v-card-actions>
                <hv-nav-palette :layer="layer"></hv-nav-palette>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-card-actions>
        <v-btn color="primary" block @click.native="filterModal(layer)">Opções da Camada</v-btn>
      </v-card>
    </v-expansion-panel-content>
    <v-expansion-panel-content v-else :hide-actions="true" @click.native.stop="urlByEntryPoint(layer.url)">
      <div slot="header">{{ layer.operationName || layer.short_name() }}</div>
    </v-expansion-panel-content>
  </v-expansion-panel>

  <v-expansion-panel class="blue-grey lighten-3">
    <v-expansion-panel-content class="grey darken-2">
      <div slot="header">Camada Base</div>
      <v-radio-group v-model="baseLayersRadio" style="margin-left: 25px;">
        <v-radio v-for="(base, i) in baseLayers" :key="i" :label="`Camada base ${base.name}`" :value="base.name"></v-radio>
      </v-radio-group>
    </v-expansion-panel-content>
  </v-expansion-panel>

  <v-dialog v-model="filtersDialog" max-width="1200">
      <hv-filters-modal @addFilter="addFilter" @close="filtersDialog = false" ref="filterModal"></hv-filters-modal>
  </v-dialog>

  </v-navigation-drawer>
  <v-toolbar class="cyan" fixed clipped-left app>
    <v-toolbar-title>
      <v-toolbar-side-icon @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
    </v-toolbar-title>
    <v-spacer></v-spacer>

    <input type="text" v-model="urlSearch" placeholder="Enter URL here..." @keyup.enter="urlEntered"> </input>
    <v-btn icon @click.native="urlEntered">
      <v-icon>search</v-icon>
    </v-btn>
    <v-btn class="choice-btn" color="cyan lighten-1" @click.native="choiceRenderMode(renderMode)">
      {{ renderMode.render }}
      <v-icon>{{ renderMode.icon }}</v-icon>
    </v-btn>
    </v-toolbar>
  </div>
</template>

<script>
import axios from 'axios'
import { loadLayer } from '../utils/layerUtils.js'
import hvFiltersModal from './hv-filters-modal'
import HvNavPalette from './hv-nav-palette'

export default {
  name: 'hv-nav',
  props: [ 'layers' ],
  components: { hvFiltersModal, HvNavPalette },
  data () {
    return {
      filtersDialog: false,
      drawer: false,
      showLayerUrl: false,
      renderMode: {icon: 'grain', render: 'vector'},
      urlSearch: '',
      optionValue: '',
      baseLayersRadio: 'OSM',
      baseLayers: [
        {name: 'OSM', active: true},
        {name: 'google', active: false},
        {name: 'satelite', active: false},
        {name: 'watercolor', active: false},
        {name: 'wikimedia', active: false},
        {name: 'nenhuma', active: false}
      ]
    }
  },
  methods: {
    addFilter (url) {
      this.$emit('addOperation', this.renderMode.render, url)
    },
    changeLayerVisibility (layer) {
      (layer.vector_layer.getVisible()) ? layer.vector_layer.setVisible(false) : layer.vector_layer.setVisible(true)
    },
    choiceRenderMode (renderMode) {
      renderMode.render === 'vector' ? this.renderMode = {icon: 'image', render: 'image'} : this.renderMode = {icon: 'grain', render: 'vector'}
    },
    filterModal (layer) {
      this.$refs.filterModal.url = layer.url
      this.$refs.filterModal.layerName = layer.operationName || layer.short_name()
      this.$refs.filterModal.options = layer.options_response
      this.filtersDialog = true
    },
    removeLayer (layer, index) {
      this.$emit('removeLayer', layer, index)
    },
    switchLabel (value) {
      return value ? 'Ativo' : 'Inativo'
    },
    urlByEntryPoint (url) {
      this.urlSearch = url.endsWith('/') ? url : `${url}/`
      this.urlEntered()
    },
    urlChecker (url) {
      const startsWith = url.startsWith('http://') || url.startsWith('https://') ? url : `http://${url}`
      return startsWith.endsWith('/') ? startsWith : `${startsWith}/`
    },
    async urlEntered () {
      const url = this.urlChecker(this.urlSearch)
      await this.urlsIsEntryPoint(url)
        ? this.$emit('entryPoint', url)
        : this.$emit('urlEntered', this.renderMode.render, url)
      this.urlSearch = ''
    },
    async urlsIsEntryPoint (url) {
      const header = await axios.head(url)
      let entryPoint = null
      header.headers.link
        ? entryPoint = header.headers.link.includes('EntryPoint')
        : entryPoint = false
      return entryPoint
    },
    zoomToLayer (layerResource) {
      this.$emit('zoom', layerResource)
    }
  },
  watch: {
    baseLayersRadio (value, oldValue) {
      this.$emit('switchBaseLayer', value, oldValue)
    }
  }
}
</script>

<style scoped>
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
  .fade-enter-active, .fade-leave-active {
    transition: opacity .8s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  .choice-btn {
    min-width: 139px;
  }
</style>
