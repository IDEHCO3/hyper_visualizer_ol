<template>
  <div id="app">
    <hv-baseview/>
  </div>
</template>

<script>
import HvBaseview from './components/hv-baseview'

export default {
  name: 'app',
  components: { HvBaseview }
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
