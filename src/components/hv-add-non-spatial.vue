<template>
  <v-card class="add-non-spatial">

    <div class="add-non-spatial__input">
      <input class="add-non-spatial__input__text-field" type="text" placeholder="URL da API com dados não espaciais" v-model="nonSpatialUrl" @keyup.enter.stop="getNonSpatialProperties">
      <v-icon class="add-non-spatial__input__icon" @click.stop="getNonSpatialProperties">search</v-icon>
    </div>

    <div class="add-non-spatial__selects">
      <div class="add-non-spatial__selects__container">
            <div>Propriedades da Camada</div>
            <v-card>
              <v-list v-if="layerFeatures[0]">
                <v-list-tile class="list" v-for="(property, index) in Object.entries(layerFeatures[0].getProperties())" :key="index">

                  <v-list-tile-content>
                    <v-list-tile-title class="black--text">{{ property[0] }}</v-list-tile-title>
                  </v-list-tile-content>

                  <v-list-tile-action style="position: absolute; top: -0.5rem; right: 1rem;">
                      <v-radio-group v-model="layerMerge">
                        <v-tooltip top close-delay="50">
                          <v-radio slot="activator" light :value="property[0]" color="primary"></v-radio>
                          <span>Join</span>
                        </v-tooltip>
                      </v-radio-group>
                  </v-list-tile-action>
                </v-list-tile>
              </v-list>
            </v-card>
      </div>

      <div class="add-non-spatial__selects__container">
         Propriedades Não Espaciais
        <v-list>
          <template v-for="(property, nonSpatialPropertyIndex) in nonSpatialProperties">
            <v-list-tile class="list" :key="nonSpatialPropertyIndex">
              <v-list-tile-content>
                <v-list-tile-title class="black--text">{{ property['hydra:property'] }}</v-list-tile-title>
              </v-list-tile-content>

                <v-list-tile-action style="position: relative; top: -8px;">
                  <v-radio-group v-model="nonSpatialMerge">
                    <v-tooltip top close-delay="50">
                      <v-radio slot="activator" light :value="property['hydra:property']" color="primary"></v-radio>
                      <span>Join</span>
                    </v-tooltip>
                  </v-radio-group>
                </v-list-tile-action>

                <v-list-tile-action class="select__checkbox">
                  <v-tooltip top close-delay="50">
                    <v-checkbox slot="activator" light class="add-non-spatial__checkbox__item" v-model="propertiesToAdd" :value="property['hydra:property']"></v-checkbox>
                    <span>Selecione para adicionar</span>
                  </v-tooltip>
                </v-list-tile-action>

            </v-list-tile>
          </template>
        </v-list>
      </div>
      
    </div>
    <v-btn @click="addPropertiesInLayer">Adicionar Propriedades</v-btn>
    <v-btn @click="close">FECHAR</v-btn>
  </v-card>
</template>

<script>
import axios from 'axios'

export default {
  name: 'hv-add-non-spatial',
  data () {
    return {
      layerFeatures: [],
      nonSpatialProperties: [],
      nonSpatialUrl: '',
      layerMerge: '',
      nonSpatialMerge: '',
      propertiesToAdd: []
    }
  },
  methods: {
    async addPropertiesInLayer () {
      await this.layerFeatures.map(async layer => {
        const url = `${this.nonSpatialUrl}filter/${this.nonSpatialMerge}/eq/${layer.getProperties()[this.layerMerge]}`
        try {
          const response = await axios.get(url)
          response.data.map(prop => {
            Object.keys(prop).map(propKey => {
              if (this.propertiesToAdd.includes(propKey)) {
                layer.setProperties({[propKey]: prop[propKey]})
              }
            })
          })
        } catch (error) {
          this.clearField()
          console.log(error)
        }
      })
      //this.close()
    },
    async getNonSpatialProperties () {
      this.nonSpatialUrl = this.nonSpatialUrl.endsWith('/') ? this.nonSpatialUrl : `${this.nonSpatialUrl}/`
      const nonSpatialProperties = await axios.options(this.nonSpatialUrl)
      this.nonSpatialProperties = nonSpatialProperties.data['hydra:supportedProperties']
    },
    clearField () {
      this.layerFeatures = [],
      this.nonSpatialProperties = [],
      this.nonSpatialUrl = '',
      this.layerMerge = '',
      this.nonSpatialMerge = '',
      this.propertiesToAdd = []
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.add-non-spatial {
  padding: 20px;
}
.add-non-spatial__input {
  position: relative;
}
.add-non-spatial__input__text-field {
  width: 100%;
  padding: 5px;
  padding-right: 4rem;
  background: rgba(255, 255, 255, 0.1);
  border-bottom: 3px solid #1E88E5;
  outline-style: none;
}
.add-non-spatial__input__text-field::placeholder {
  color: #E0E0E0;
}
.add-non-spatial__input__icon {
  position: absolute;
  top: 0.3rem;
  right: 1rem;
  cursor: pointer;
  transition: 0.5s;
}
.add-non-spatial__input__icon:hover {
  color: #1E88E5;
}
.add-non-spatial__selects {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  margin: 20px;
}
.add-non-spatial__selects__container {
  width: 400px;
  height: 100%;
  max-height: 500px;
  overflow-x: hidden;
  border: 1px solid #78909C;
}
.list:nth-child(odd) {
  background-color: #ECEFF1;
}
.list:nth-child(even) {
  background-color: #CFD8DC;
}
.add-non-spatial__checkbox {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}
.add-non-spatial__checkbox__item {
  width: 100%;

}
label {
  background: blue;
  color: #000;
}
.select__checkbox {
  width: 50px;
}
</style>