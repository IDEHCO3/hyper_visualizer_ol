<template>
  <div class="palette">
    <ul class="color-container">
      <li class="color-box" v-for="color in palette" :key="color"
        @click="handlerClick(color)"
        :style="{background: color}">
        <div class="color-selected" v-show="color === selectedColor"></div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'palette-color',
  props: ['layer'],
  data () {
    return {
      selectedColor: null,
      palette: [
        '#4D4D4D', '#999999', '#FFFFFF', '#F44E3B', '#FE9200', '#FCDC00',
        '#DBDF00', '#A4DD00', '#68CCCA', '#73D8FF', '#AEA1FF', '#FDA1FF',
        '#333333', '#808080', '#CCCCCC', '#D33115', '#E27300', '#FCC400',
        '#B0BC00', '#68BC00', '#16A5A5', '#009CE0', '#7B64FF', '#FA28FF',
        '#000000', '#666666', '#B3B3B3', '#9F0500', '#C45100', '#FB9E00',
        '#808900', '#194D33', '#0C797D', '#0062B1', '#653294', '#AB149E'
      ]
    }
  },
  methods: {
    handlerClick(color) {
      this.selectedColor = color
      this.$emit('selectedColor', this.layer, color)
    }
  }
}
</script>

<style scoped>
.palette {
  padding-top: 5px;
  padding-left: 5px;
  width: 265px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0,0,0,.12), 0 2px 5px rgba(0,0,0,.16);
  background-color: #fff;
}
.color-container {
  overflow: hidden;
  padding: 0;
  margin: 0;
}
.color-box {
  list-style: none;
  width: 16px;
  height: 16px;
  float: left;
  margin-right: 5px;
  margin-bottom: 5px;
  position: relative;
  cursor: pointer;
  border-radius: 8px;
  box-shadow: inset 0 0 0 1px #333;
}
.color-selected::after {
  content: '';
  height: 12px;
  border-left: 3px solid #f00;
  position: absolute;
  transform: rotate(-45deg);
  top: 2px;
  left: 8px;
}
.color-selected::before {
  position: absolute;
  content: '';
  height: 12px;
  border-left: 2px solid #f23;
  position: absolute;
  transform: rotate(45deg);
  top: 1px;
  left: 8px;
}
</style>