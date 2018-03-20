<template>
<div>
  <v-navigation-drawer persistent clipped enable-resize-watcher v-model="drawer" app>

  <v-expansion-panel expand dense >
    <v-expansion-panel-content v-for="(layer, layerIndex) in layers" :key="layerIndex" class="mb-2">
      <div slot="header">{{ layer.operationName || layer.short_name() }}</div>

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

        <transition name="fade">
          <v-expansion-panel popout v-show="layer.vector_layer.getVisible()">
            <v-expansion-panel-content class="cyan darken-2">
              <div slot="header">Opções da camada</div>
              <v-list dense>
                <v-list-tile v-for="(option, index) in layer.options_response.supported_operations" :key="index">
                  <v-list-tile-title> {{ option['hydra:operation'] }} </v-list-tile-title>

                  <v-menu offset-x :close-on-content-click="false" v-if="option['hydra:expects'].length > 0">
                    <v-btn icon slot="activator">
                      <v-icon color="indigo accent-4">layers</v-icon>
                    </v-btn>
                    <v-card dark>
                      <v-card-actions>
                        <input dark type="text" v-model="optionValue" @keyup.enter="addOperation(layer, option)"></input>
                        <v-btn icon color="primary" flat @click.native="addOperation(layer, option)">
                          <v-icon>input</v-icon>
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-menu>

                  <v-btn icon v-else style="left: -3px" @click.stop="addOperation(layer, option)">
                    <v-icon color="cyan lighten-4">info</v-icon>
                  </v-btn>

                </v-list-tile>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </transition>

      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>

  </v-navigation-drawer>
    <v-toolbar class="cyan" fixed clipped-left app>
      <v-toolbar-title >
        <v-toolbar-side-icon @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <input type="text" v-model="urlSearch" placeholder="Enter URL here..." @keyup.enter="urlEntered"> </input>
      <v-btn icon @click.native="urlEntered">
        <v-icon>search</v-icon>
      </v-btn>
    </v-toolbar>
    </div>
</template>

<script>
import { loadLayer } from '../utils/layerUtils.js'
import HvNavPalette from './hv-nav-palette'

export default {
  name: 'hv-nav',
  props: [ 'layers' ],
  components: { HvNavPalette },
  data () {
    return {
      drawer: false,
      urlSearch: '',
      optionValue: ''
    }
  },
  methods: {
    addOperation (layer, operation) {
      const url = this.optionValue.length > 0 ? `${layer.url}${operation['hydra:operation']}/${this.optionValue}/` : `${layer.url}${operation['hydra:operation']}/`
      const operationName = `${layer.short_name()} / ${operation['hydra:operation']} / ${this.optionValue}`
      const returnInfo = operation["hydra:returns"].startsWith('http://schema.org/') // CASO A OPERAÇÃO RETORNE UM VALOR PRIMITIVO - TRUE
      if (!returnInfo) {
        this.$emit('addOperation', url, operationName)
      }
      this.optionValue = ''
    },
    changeLayerVisibility (layer) {
      (layer.vector_layer.getVisible()) ? layer.vector_layer.setVisible(false) : layer.vector_layer.setVisible(true)
    },
    removeLayer (layer, index) {
      this.$emit('removeLayer', layer, index)
    },
    switchLabel (value) {
      return value ? 'Ativo' : 'Inativo'
    },
    urlEntered () {
      this.urlSearch = this.urlSearch.endsWith('/') ? this.urlSearch : `${this.urlSearch}/`
      this.$emit('urlEntered', this.urlSearch)
      this.urlSearch = ''
    },
    zoomToLayer (layerResource) {
      this.$emit('zoom', layerResource)
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
</style>
