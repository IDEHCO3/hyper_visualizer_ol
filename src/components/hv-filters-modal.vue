<template>
  <v-card v-if="options.context">
    <v-card-title class="headline">Opções da camada: {{ layerName }}</v-card-title>
    <div class="container">

      <div class="atributos">
        Atributos
        <v-list>
          <v-list-tile class="campos-list" v-for="(attribute, index) in Object.keys(options.context)" :key="index">
            <v-list-tile-content>
              <v-list-tile-title class="black--text">{{ attribute }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon v-if="expressao.includes('{attribute}')" class="attribute-button" @click.native.stop="includeAttribute(attribute)">
                <v-icon>send</v-icon>
              </v-btn>
              <v-btn icon v-else class="grey lighten-1" @click.native.stop="showAttribute(attribute)">
                <v-icon>search</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </div>

      <v-card class="grey lighten-5 amostras" flat>
        <v-card-text>
          <v-flex xs12>
            <v-text-field
              name="Amostras"
              :value="attributes"
              textarea
              light
              full-width
              readonly
            ></v-text-field>
          </v-flex>
        </v-card-text>
      </v-card>

      <div class="opcoes">
        Opções
        <v-list>
          <v-list-tile class="campos-list" v-for="(option, index) in options.supported_operations" :key="index">

            <v-list-tile-content>
              <v-list-tile-title class="black--text">{{ option['hydra:operation'] }}</v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action v-if="option['hydra:expects'].length">
              <v-btn icon ripple class="light-blue lighten-1" @click.stop="filterSelected(option)">
                <v-icon>send</v-icon>
              </v-btn>
            </v-list-tile-action>

            <v-list-tile-action v-else>
              <v-btn icon ripple @click.stop="functionSelected(option)" :class="option['hydra:returns'].includes('geojson') ? 'light-blue lighten-1' : ''">
                <v-icon v-if="option['hydra:returns'].includes('geojson')">layers</v-icon>
                <v-icon v-else color="light-blue darken-4">info</v-icon>
              </v-btn>
            </v-list-tile-action>

          </v-list-tile>
        </v-list>
      </div>

      <div class="valores">
        Valores
        <v-list>
          <template v-for="(filter, index) in uris" >
            <v-list-tile class="campos-list" v-if="filter.filter" :key="index">
              <v-list-tile-content>
                <v-list-tile-title class="black--text">{{ filter.filter }}</v-list-tile-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-text-field
                  name="Valor"
                  label="Valor"
                  v-model="filter.value"
                  required
                  class="input-group--focused blue-grey lighten-3"
                ></v-text-field>
              </v-list-tile-action>
              <v-list-tile-action>
                <v-btn icon class="red lighten-1" @click.native="removeFilter(filter)">
                  <v-icon>remove</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </template>
        </v-list>
      </div>

      <div class="operadores">
        <v-btn class="grey lighten-3 black--text" @click="includeOperator('eq')">=</v-btn>
        <v-btn class="grey lighten-3 black--text" @click="includeOperator('neq')">!=</v-btn>
        <v-btn class="grey lighten-3 black--text" @click="includeOperator('gt')">></v-btn>
        <v-btn class="grey lighten-3 black--text" @click="includeOperator('lt')"><</v-btn>
        <v-btn class="grey lighten-3 black--text" @click="includeOperator('gte')">>=</v-btn>
        <v-btn class="grey lighten-3 black--text" @click="includeOperator('lte')"><=</v-btn>
        <v-btn class="grey lighten-3 black--text" @click="includeOperator('between')">between</v-btn>
        <v-btn class="grey lighten-3 black--text" @click="includeOperator('isnull')">null</v-btn>
        <v-btn class="grey lighten-3 black--text" @click="includeOperator('isnotnull')">not null</v-btn>
        <v-btn class="grey lighten-3 black--text" @click="includeOperator('like')">like</v-btn>
        <v-btn class="grey lighten-3 black--text" @click="includeOperator('notlike')">not like</v-btn>
        <v-btn class="grey lighten-3 black--text" @click="includeOperator('in')">in</v-btn>
        <v-btn class="grey lighten-3 black--text" @click="includeOperator('notin')">not in</v-btn>
        <v-btn class="grey lighten-3 black--text" @click="includeOperator('and')">and</v-btn>
        <v-btn class="grey lighten-3 black--text" @click="includeOperator('or')">or</v-btn>
      </div>

      <div class="expressao">
        <v-text-field name="expressao de filtragem" label="Expressão de filtragem específica" dark v-model="expressao" full-width></v-text-field>
      </div>

      <div class="botoes">
        <v-btn class="cyan darken-1" @click.native="addFilters(expressionUrl)">Ok</v-btn>
        <v-btn class="blue-grey lighten-1" @click.native="clearUris">Limpar</v-btn>
        <v-btn class="blue-grey lighten-1" @click.native="close">Cancelar</v-btn>
      </div>

    </div>
  </v-card>
</template>

<script>
import axios from 'axios'

export default {
  name: 'filters-modal',
  data () {
    return {
      layerName: '',
      attributes: [],
      options: [],
      url: '',
      uris: [],
      expressionUrl: ''
    }
  },
  methods: {
    showAttribute (attribute) {
      this.clearAttributes()
      axios.get(this.url + attribute).then(res => {
        /* REFATORAR */
        if (res.data[0]) {
          res.data.map(item => {
            for (const [property_name, property_value] of Object.entries(item)) {
              this.attributes += `${property_name}: ${property_value}
` 
        }
          })
        } else {
          for (const [property_name, property_value] of Object.entries(res.data)) {
            this.attributes += `${property_name}: ${property_value}
` 
          }
        }
      })
    },
    includeAttribute (attribute) {
      const uri = this.uris.find(item => item.value.includes('{attribute}'))
      const uriIndex = this.uris.indexOf(uri)
      const newValue = uri.value.replace(/{attribute}/, attribute)
      this.uris[uriIndex].value = newValue
    },
    clearAttributes () {
      this.attributes = []
    },
    addFilters (url) {
      this.$emit('addFilter', url)
      this.close()
    },
    filterExpects (expects) {
      if (expects) {
        return expects.map(expect => expect.includes('schema') ? expect.split('/').reverse()[0] : expect.split('#').reverse()[0])
      }
    },
    filterSelected (filter) {
      let expects = this.filterExpects(filter['hydra:expects'])
      if (expects.includes('expression')) {
        expects = "attribute}/{operator}/{value"
      }
      this.uris.push({filter: filter['hydra:operation'], value: `{${expects}}`})
    },
    async functionSelected (option) {
      const url = `${this.url}${option['hydra:operation']}`
      if (!option['hydra:returns'].includes('geojson')) {
        this.clearAttributes()
        const optionResponse = await axios.get(url)
        this.attributes = Object.entries(optionResponse.data).map(item => item.join('\n'))
      } else {
        this.addFilters(url)
      }
    },
    removeFilter (filter) {
      const filterIndex = this.uris.indexOf(filter)
      this.uris.splice(filterIndex, 1)
    },
    hasOperator (uris) {
      return this.uris.filter(uri => uri.value.includes('{operator}'))
    },
    includeOperator (value) {
      if (this.hasOperator(this.uris).length) {
        const uri = this.uris.find(item => item.value.includes('{operator}'))
        const uriIndex = this.uris.indexOf(uri)
        const newValue = uri.value.replace(/{operator}/, value)
        this.uris[uriIndex].value = newValue
      } else {
        this.uris.push({value})
      }
    },
    clearUris () {
      this.uris = []
    },
    close () {
      this.clearUris()
      this.clearAttributes()
      this.$emit('close')
    }
  },
  computed: {
    expressao: {
      get: function () {
        const uris = this.uris.map(filter =>
          filter.filter ? `${filter.filter}/${filter.value || 'valor'}/` : `${filter.value || 'valor'}/`
        ).join('')
        this.expressionUrl = this.url + uris
        return this.url + uris
      },
      set: function (newValue) {
        this.expressionUrl = newValue
      }
    }
  }
}
</script>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
  'atributos amostras'
  'opcoes valores'
  'operadores operadores'
  'expressao expressao'
  'botoes botoes';
  grid-column-gap: 10px;
  grid-row-gap: 5px;
}
.atributos {
  height: 200px;
  border:1px solid #EEEEEE;
  grid-area: atributos;
  overflow: auto;
}
.amostras {
  height: 200px;
  border:1px solid #EEEEEE;
  grid-area: amostras;
  overflow: auto;
}
.opcoes {
  height: 300px;
  border:1px solid #EEEEEE;
  grid-area: opcoes;
  overflow: auto;
}
.valores {
  height: 300px;
  border:1px solid #EEEEEE;
  grid-area: valores;
  overflow: auto;
}
.operadores {
  height: 100px;
  border:1px solid #EEEEEE;
  grid-area: operadores;
}
.expressao {
  padding: 0px;
  height: 70px;
  border:1px solid #EEEEEE;
  grid-area: expressao;
  overflow: auto;
}
.botoes {
  grid-area: botoes;
}
.campos-list:nth-child(odd), .valores-list:nth-child(odd) {
  background: #ECEFF1;
}
.campos-list:nth-child(even), .valores-list:nth-child(even) {
  background: #CFD8DC;
}
.attribute-button {
    animation-name: attribute-button;
    animation-duration: 3s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
}
@keyframes attribute-button {
  0%   {background-color: #B3E5FC}
  25%  {background-color: #4FC3F7}
  50%  {background-color: #29B6F6}
  75%  {background-color: #4FC3F7}
  100% {background-color: #B3E5FC}
}
</style>
