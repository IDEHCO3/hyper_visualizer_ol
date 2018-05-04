<template>
  <v-card>
    <v-card-title class="headline">Filtros da camada: {{ layerName }}</v-card-title>
    <div class="container">

      <div class="campos">
        Campos
        <v-list>
          <v-list-tile class="campos-list" v-for="(filter, index) in filters" :key="index">
            <v-list-tile-content>
              <v-list-tile-title class="black--text">{{ filter['hydra:operation'] }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon ripple class="grey lighten-1" @click.stop="filterSelected(filter)">
                <v-icon>send</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </div>

      <div class="valores">
        Valores
        <v-list>
          <v-list-tile class="campos-list" v-for="(filter, index) in uris" :key="index">
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
        </v-list>
      </div>

      <div class="operadores">

      </div>
      <div class="expressao">
        <v-text-field name="expressao de filtragem" label="Expressão de filtragem específica" dark v-model="expressao" full-width></v-text-field>
      </div>

      <div class="botoes">
        <v-btn class="cyan darken-1" @click.native="addFilters">Ok</v-btn>
        <v-btn class="blue-grey lighten-1" @click.native="clearUris">Limpar</v-btn>
        <v-btn class="blue-grey lighten-1" @click.native="close">Cancelar</v-btn>
      </div>

    </div>
  </v-card>
</template>

<script>
export default {
  name: 'filters-modal',
  data () {
    return {
      layerName: '',
      filters: [],
      url: '',
      uris: []
    }
  },
  methods: {
    addFilters () {
      this.$emit('addFilter', this.expressao)
      this.close()
    },
    filterSelected (filter) {
      const expects = this.filterExpects(filter['hydra:expects'])
      this.uris.push({filter: filter['hydra:operation'], value: `{${expects}}`})
    },
    removeFilter (filter) {
      const filterIndex = this.uris.indexOf(filter)
      this.uris.splice(filterIndex, 1)
    },
    clearUris () {
      this.uris = []
    },
    close () {
      this.clearUris()
      this.$emit('close')
    },
    filterExpects (expects) {
      if (expects) {
        return expects.map(expect => expect.includes('schema') ? expect.split('/').reverse()[0] : expect.split('#').reverse()[0])
      }
    }
  },
  computed: {
    expressao () {
      const uris = this.uris.map(filter => `${filter.filter}/${filter.value || 'valor'}/`).join('')
      return this.url + uris
    }
  }
}
</script>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
  'campos valores'
  'operadores operadores'
  'expressao expressao'
  'botoes botoes';
  grid-column-gap: 10px;
  grid-row-gap: 5px;
}
.campos {
  height: 400px;
  border:1px solid #EEEEEE;
  grid-area: campos;
  overflow: auto;
}
.valores {
  height: 400px;
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
</style>
