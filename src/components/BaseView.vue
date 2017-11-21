<template>
  <v-app dark id="inspire">
    <v-navigation-drawer persistent clipped enable-resize-watcher v-model="drawer" app>
            <v-list dense >
        <v-expansion-panel expand>
          <v-expansion-panel-content>
            <div slot="header">Camadas</div>
              <v-list-tile v-for="(layer, index) in layers" :key="index" class="cyan accent-4" >
                <v-list-tile-action>
                  <v-btn icon @click.native="remove_layer_from_layers(layer)">
                    <v-icon dark>delete </v-icon>
                  </v-btn>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-switch color="cyan accent-2" v-model="layer.vector_layer.getVisible" dark @change="changedCheckbox(layer)"></v-switch>
                </v-list-tile-content>
                <v-list-tile-content>
                  {{ layer.short_name() }}
                </v-list-tile-content>
              </v-list-tile>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-list>

      <v-list dense >
        <v-expansion-panel expand>
          <v-expansion-panel-content>
            <div slot="header">Opções</div>
              <v-expansion-panel expand>
                <v-expansion-panel-content v-for="(layer, index) in layers" :key="index" class="cyan accent-4" >
                  <div slot="header" >{{ layer.short_name() }}</div>
                    <v-list >
                    <v-btn class="ml-5" flat @click.native.stop="removeOption(layer, index)">Excluir Opções
                      <v-icon class="ml-2"color="red darken-2">layers_clear</v-icon>
                    </v-btn>
                      <v-list-tile v-for="(option, optionIndex) in layer.options_response.supportedOperations" :key="optionIndex" @click="" class="cyan lighten-1" >
                        <v-list-tile-content>
                          <v-list-tile-title v-text="option['hydra:operation'].toUpperCase()" ></v-list-tile-title>
                        </v-list-tile-content>
 
                        <v-tooltip left>
                          <v-btn icon slot="activator">
                            <v-icon color="cyan lighten-4">info</v-icon>
                          </v-btn>
                          <span v-for="expect in option['hydra:expects']">{{expect}}</span>
                        </v-tooltip>

                        <v-list-tile-action>
                          <v-menu offset-x :close-on-content-click="false" >
                            <v-btn icon slot="activator" >
                              <v-icon color="indigo accent-4">layers</v-icon>
                            </v-btn>
                            <v-card dark >
                              <v-card-actions>
                                <input dark type="text" v-model="optionValue" @keyup.enter="addOption(layer, option['hydra:operation'])"> </input>
                                <v-spacer></v-spacer>
                                <v-btn icon color="primary" flat @click.native="addOption(layer, option['hydra:operation'])">
                                  <v-icon >input</v-icon>
                                </v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-menu>
                        </v-list-tile-action>

                      </v-list-tile>
                    </v-list>
                </v-expansion-panel-content>
              </v-expansion-panel>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar class="cyan" fixed clipped-left app>
      <v-toolbar-title >
        <v-toolbar-side-icon @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <input type="text" v-model="urlSearched" placeholder="Enter URL here..." @keyup.enter="loadLayer(urlSearched)"> </input>
      <v-btn icon @click.native="loadLayer(urlSearched)">
        <v-icon>search</v-icon>
      </v-btn>
      <v-btn icon @click.native="teste">
        teste
      </v-btn>
    </v-toolbar>

    <main>
      <v-content>
        <v-layout justify-center align-center>
          <div id="map" class="map"></div>
        </v-layout>
      </v-content>
    </main>

  </v-app>
</template>
<script>
  import axios from 'axios';
  import ol from 'openlayers';
  import geojsonVT from 'geojson-vt';
  import {Layer, OptionsLayer} from './options';

  var optionStyle = {
          "color": "#6666ff",
          "weight": 5,
          "opacity": 0.45
      };
  var replacer = function(key, value) {
    if (value.geometry) {
      var type;
      var rawType = value.type;
      var geometry = value.geometry;

      if (rawType === 1) {
        type = 'MultiPoint';
        if (geometry.length == 1) {
          type = 'Point';
          geometry = geometry[0];
        }
      } else if (rawType === 2) {
        type = 'MultiLineString';
        if (geometry.length == 1) {
          type = 'LineString';
          geometry = geometry[0];
        }
      } else if (rawType === 3) {
        type = 'Polygon';
        if (geometry.length > 1) {
          type = 'MultiPolygon';
          geometry = [geometry];
        }
      }

      return {
        'type': 'Feature',
        'geometry': {
          'type': type,
          'coordinates': geometry
        },
        'properties': value.tags
      };
    } else {
      return value;
    }
  };

  var tilePixels = new ol.proj.Projection({
    code: 'TILE_PIXELS',
    units: 'tile-pixels'
  });
  function onEachFeature (feature, layer) {

     if (feature.properties) {
       let result = '';
       for (const [property_name, property_value] of Object.entries(feature.properties)) {
         result += "<p>" + property_name + ": " + property_value + "</p>";
       }
       layer.bindPopup(result);
     }
 };
  var map;
  export default {
      data: () => ({
        drawer: true,
        json: null,
        optionValue: '',
        urlSearched: '',
        layers: [],
      }),
      methods: {
        teste(){console.log(this.layers)},
        addOption(layer, option){
          axios.get(`${layer.url}${option}/${this.optionValue}`)
            .then(res => {
              layer.optionsLayer.push({
                json: res.data, 
                leaflet_optionLayer: L.geoJSON(res.data, { style: optionStyle }).addTo(map)
              })
            });
          this.optionValue = '';
        },
        removeOption(layer, index){
          layer.optionsLayer.map( option => option.leaflet_optionLayer.remove() );
          this.layers[index].optionsLayer = [];
        },
        add_layer(a_layer) {
          var tileIndex = geojsonVT(a_layer.json, {
            extent: 4096,
            debug: 1
          });
          a_layer.vector_source = new ol.source.VectorTile({
            format: new ol.format.GeoJSON(),
            tileLoadFunction (tile) {
              var format = tile.getFormat();
              var tileCoord = tile.getTileCoord();
              var data = tileIndex.getTile(tileCoord[0], tileCoord[1], -tileCoord[2] - 1);
              var features = format.readFeatures(
                  JSON.stringify({
                    type: 'FeatureCollection',
                    features: data ? data.features : []
                  }, replacer));
              tile.setLoader(function() {
                tile.setFeatures(features);
                tile.setProjection(tilePixels);
              });
            },
            url: 'data:' // arbitrary url, we don't use it in the tileLoadFunction
          });
          a_layer.vector_layer = new ol.layer.VectorTile({
            source: a_layer.vector_source
          });
          map.addLayer(a_layer.vector_layer);
        },
        add_visibility_layer(a_layer) {
          a_layer.vector_layer.setVisible(true);
        },
        remove_visibility_layer(a_layer) {
          a_layer.vector_layer.setVisible(false);
          //a_layer.optionsLayer.map( option => option.leaflet_optionLayer.remove() );
        },
        remove_layer_from_layers(a_layer) {
          let index = this.layers.indexOf(a_layer);
          if (index > -1) {
            this.remove_visibility_layer(a_layer);
            this.layers.splice(index, 1);
          }
        },
        layers_includes(an_url) {
          let size_of_layers = this.layers.length;
          for (let i=0; i<size_of_layers; i++) {
              if (this.layers[i].url == an_url)
                return true;
          }
          return false;
        },
        loadLayer(an_url) {
        //"http://127.0.0.1:8000/instituicoes/ibge/bcim/unidades-federativas/ES/"
          let url = an_url.endsWith('/') ? an_url : `${an_url}/`;
          if (this.layers_includes(url))
                return;
          axios.all([axios.get(an_url), axios.options(an_url)])
                .then(axios.spread((response_get, response_options)=> {
                  let a_layer = new Layer();
                  a_layer.json = response_get.data;
                  a_layer.url = url;
                  this.layers.push(a_layer);
                  this.add_layer(a_layer);
                  a_layer.options_response = new OptionsLayer(
                    response_options.data['hydra:supportedProperties'],
                    response_options.data['hydra:supportedOperations'],
                    response_options.data['@context'],
                    response_options.data['hydra:iriTemplate']
                    );
                  a_layer.optionsLayer = [];

                }))
                .catch(error => {
                  console.log(error);
                });
        },
        changedCheckbox(a_layer) {
          a_layer.vector_layer.getVisible ? this.add_visibility_layer(a_layer) : this.remove_visibility_layer(a_layer)
        }
      },
      mounted() {
        map = new ol.Map({
          target: 'map',
          layers: [
            new ol.layer.Tile({
              source: new ol.source.OSM()
            })
          ],
          view: new ol.View({
            center: [0, 0],
            zoom: 4
          })
        });
      },
      created() {
      }
    }
</script>
<style scoped>
  #map { 
    height: 93vh;
    width: 100%;
    position: relative;
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
