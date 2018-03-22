<template>
  <div class="palette">
    <ul class="color-container">
      <li class="color-box" v-for="color in palette" :key="color.hex"
        @click="handlerClick(color)"
        :style="{background: color.hex}">
        <div class="color-selected" v-show="color.hex === selectedColor"></div>
      </li>
    </ul>
  </div>
</template>

<script>
import { style as ol_style} from 'openlayers'

export default {
  name: 'palette-color',
  props: ['layer'],
  data () {
    return {
      selectedColor: null,
      palette: [
        {hex: '#4D4D4D', rgba: 'rgba(77,77,77, 0.5)'}, {hex: '#999999', rgba: 'rgba(153,153,153, 0.5)'},
        {hex: '#FFFFFF', rgba: 'rgba(255,255,255, 0.5)'}, {hex: '#F44E3B', rgba: 'rgba(244,78,59, 0.5)'},
        {hex: '#FE9200', rgba: 'rgba(254,146,0, 0.5)'}, {hex: '#FCDC00', rgba: 'rgba(252,220,0, 0.5)'},
        {hex: '#DBDF00', rgba: 'rgba(219,223,0, 0.5)'}, {hex: '#A4DD00', rgba: 'rgba(164,221,0, 0.5)'},
        {hex: '#68CCCA', rgba: 'rgba(104,204,202, 0.5)'}, {hex: '#73D8FF', rgba: 'rgba(115,216,255, 0.5)'},
        {hex: '#AEA1FF', rgba: 'rgba(174,161,255, 0.5)'}, {hex: '#FDA1FF', rgba: 'rgba(253,161,255, 0.5)'},
        {hex: '#333333', rgba: 'rgba(51,51,51, 0.5)'}, {hex: '#808080', rgba: 'rgba(128,128,128, 0.5)'},
        {hex: '#CCCCCC', rgba: 'rgba(204,204,204, 0.5)'}, {hex: '#D33115', rgba: 'rgba(211,49,21, 0.5)'},
        {hex: '#E27300', rgba: 'rgba(226,115,0, 0.5)'}, {hex: '#FCC400', rgba: 'rgba(252,196,0, 0.5)'},
        {hex: '#B0BC00', rgba: 'rgba(176,188,0, 0.5)'}, {hex: '#68BC00', rgba: 'rgba(104,188,0, 0.5)'},
        {hex: '#16A5A5', rgba: 'rgba(22,165,165, 0.5)'}, {hex: '#009CE0', rgba: 'rgba(0,156,224, 0.5)'},
        {hex: '#7B64FF', rgba: 'rgba(123,100,255, 0.5)'}, {hex: '#FA28FF', rgba: 'rgba(250,40,255, 0.5)'},
        {hex: '#000000', rgba: 'rgba(0,0,0, 0.5)'}, {hex: '#666666', rgba: 'rgba(102,102,102, 0.5)'},
        {hex: '#B3B3B3', rgba: 'rgba(179,179,179, 0.5)'}, {hex: '#9F0500', rgba: 'rgba(159,5,0, 0.5)'},
        {hex: '#C45100', rgba: 'rgba(196,81,0, 0.5)'}, {hex: '#FB9E00', rgba: 'rgba(251,158,0, 0.5)'},
        {hex: '#808900', rgba: 'rgba(128,137,0, 0.5)'}, {hex: '#194D33', rgba: 'rgba(25,77,51, 0.5)'},
        {hex: '#0C797D', rgba: 'rgba(12,121,125, 0.5)'}, {hex: '#0062B1', rgba: 'rgba(0,98,177, 0.5)'},
        {hex: '#653294', rgba: 'rgba(101,50,148, 0.5)'}, {hex: '#AB149E', rgba: 'rgba(171,20,158, 0.5)'}
      ]
    }
  },
  methods: {
    handlerClick (color) {
      this.selectedColor = color.hex
      const fill = new ol_style.Fill({ color: color.rgba }) // fundo
      const stroke = new ol_style.Stroke({ color: '#DAE6F0', width: 1.25 }) // contorno
      const new_style = new ol_style.Style({ fill, stroke })
      this.layer.vector_layer.setStyle(new_style)
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