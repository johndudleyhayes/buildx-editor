import '../lib/aframe-components/aframe-extrude-svg-component'
import '../lib/aframe-components/aframe-clone-component'
import 'aframe-orbit-controls-component-2'

import {h, div} from '@cycle/dom'
import xs from 'xstream'

import { intent, model, renderControls } from '../extras/functions'

import * as wren from '../lib/wren'

const piece = ([width, height, wallHeight], index, color) => {
  const {viewBox, points, bounds, close} = wren.frame({width: width*100, height: height*100, wallHeight: wallHeight*100, frameWidth: 10})
  const b = bounds(0)
  return h('a-entity', {attrs:{
    'extrude-svg': {
      path: close(points(index).map(([x,y]) => [(x-b.minX)/100, (y-b.minY)/100])),
      amount: 0.25
    },
    material: { color }
    // position: '0 0 0',
    // rotation: '0 0 0',
  }})
}

const renderFrames = count => {
  let frames = []
  for (let i = 1; i < count; i++) {
    frames.push(
      h('a-entity', {attrs: { clone: {id: '#frame'}, position: {x: 0, y: 0, z: Math.floor(-i/2) }}})
    )
    frames.push(
      h('a-entity', {attrs: { clone: {id: '#frame'}, position: {x: 0, y: 0, z: Math.floor(i/2)}}})
    )
  }
  return frames
}

export default function ThreeD(sources) {

  const actions = intent(sources.DOM)
  const state$ = model(actions)

  const vtree$ = state$.map(([width, height, wallHeight, bayCount]) =>
    div([
      h('a-scene', {attrs: {stats: true}}, [

        h('a-entity', [

          h('a-entity', {attrs:{ id: 'cameraTarget', position: '0 3 0' }}),

          h('a-entity', {attrs: {id: 'frames', position: `-${width/2} ${height} 0`, rotation: '180 0 0'}}, [

            h('a-entity', {attrs: {id: 'frame', position: '0 0 0'}}, [
              piece([width, height, wallHeight], 0, 'yellow'),
              piece([width, height, wallHeight], 1, 'green'),
              piece([width, height, wallHeight], 2, 'pink'),
              piece([width, height, wallHeight], 3, 'blue'),
              piece([width, height, wallHeight], 4, 'orange')
            ]),
            ...renderFrames(bayCount)
          ]),
        ]),

        h('a-entity', {attrs:{
          id: 'ground',
          geometry:{ primitive: 'plane', width: 20, height: 20},
          material: {color: '#CCC', side: 'double'},
          position: '0 -0.1 0', rotation: '-90 0 0'
        }}),


        h('a-entity', {attrs:{
          id: 'camera',
          camera: { fov: 90, zoom: 1 },
          position: {x: 0, y: 8, z: 8 },
          'orbit-controls': {
            target: '#cameraTarget',
            autoRotate: false,
            enableDamping: true,
            dampingFactor: 0.125,
            rotateSpeed:0.1,
            minDistance:3,
            maxDistance:100,
            maxPolarAngle: Math.PI/2
          }
        }})

      ]),
      ...renderControls(width, height, wallHeight, bayCount)
    ])
  )

  return { DOM: vtree$ }
}
