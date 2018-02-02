<template>
<div>
  <v-navigation-drawer persistent clipped enable-resize-watcher v-model="drawer" app>

  <v-expansion-panel expand>
    <v-expansion-panel-content v-for="layer in layers" :key="layer.json.id">
      <div slot="header">{{ layer.json.properties.sigla }}</div>
      <v-card>
        <v-card-actions>
            <v-switch :label="switchLabel(layer.vectorLayer.getVisible)" @change="changeLayerVisibility(layer.vectorLayer)"
            v-model="layer.vectorLayer.getVisible" color="primary"/></v-switch>
          <v-spacer></v-spacer>
        </v-card-actions>
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
export default {
  name: 'hv-nav',
  props: [ 'layers' ],
  data () {
    return {
    	drawer: false,
    	urlSearch: '',
      items: [
        { title: 'Home', icon: 'dashboard' },
        { title: 'About', icon: 'question_answer' }
      ]
    }
  },
  methods: {
    changeLayerVisibility (vectorLayer) {
      const visibility = vectorLayer.getVisible
      vectorLayer.setVisible(visibility)
    },
    urlEntered () {
      this.urlSearch = this.urlSearch.endsWith('/') ? this.urlSearch : `${this.urlSearch}/`
      this.$emit('urlEntered', this.urlSearch)
      this.urlSearch = ''
    },
    switchLabel (value) {
      return value ? 'Ativo' : 'Inativo'
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
</style>