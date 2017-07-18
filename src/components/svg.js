import {h, div} from '@cycle/dom'

import * as wren from '../lib/wren'
import {intent, model, renderControls} from '../extras/functions'

const SVG = require('../lib/wren/patterns/svg.js')

const frameCuts = (frame) => {
  // TODO: include naming and grouping
  var paths = [];
  for (var i=0; i<5; i++) {
    const p = SVG.closedPath(frame.points(i));
    paths.push(p);
  }
  return paths;
}

// Render as a SVG vdom tree
function renderSvg(geometry, options) {
  options = options || {};
  options.width = options.width || 600;
  options.height = options.height || 600; 

  var cuts = frameCuts(geometry.frame).map( (p) =>
    h('path', {attrs: { fill: 'none', stroke: 'red', d: p }})
  )
  const b = h('path', { attrs: { fill: 'none', stroke: 'grey', d: SVG.closedPath(geometry.boundary) }});
  const paths = cuts.concat([b]);

  return h('svg', {attrs:{ xmlns: 'http://www.w3.org/2000/svg', width: options.width, height: options.height }}, paths);
}

// SVG conventions
// origin = top-left, positive Y downwards, clockwise points
const rectangle = (width, height, o) => {
  o = o || {};
  o.x = o.x || 0;
  o.y = o.y || 0;
  return [
    [ o.x, o.y ],
    [ o.x+width, o.y ],
    [ o.x+width, o.y+height ],
    [ o.x, o.y+height ],
  ];
}

export default function renderCutsheets(sources) {

  const actions = intent(sources.DOM)
  const state$ = model(actions)

  const vtree$ = state$.map(([width, height, wallHeight, length]) => {

    const workarea = { width: 1.2, height: 2.4 }; // TODO: pass as parameters
    const cutsheet = rectangle(workarea.width*100, workarea.height*100);

    const geometry = {
      'frame': wren.frame({width: width*100, height: height*100, wallHeight: wallHeight*100, frameWidth: 10}),
      'boundary': cutsheet
    };

    return div([
      renderSvg(geometry),
      ...renderControls(width, height, wallHeight, length)
    ])
  })

  return { DOM: vtree$ }
}
