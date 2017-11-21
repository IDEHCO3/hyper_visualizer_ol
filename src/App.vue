<template>
  <div id="app">
    <v-app>
      <base-view></base-view>
    </v-app>
  </div>
</template>

<script>
import BaseView from './components/BaseView'

export default {
  name: 'app',
  components: {
    'base-view': BaseView
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
