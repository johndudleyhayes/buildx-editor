const noflo = require('noflo');

const wren = window.wren;

function clone(obj) {
    return JSON.parse(JSON.stringify(obj))
}

exports.getComponent = function() {
  var c = new noflo.Component();
  c.description = 'Merge in default Wren model parameters';
  c.icon = 'forward';
  c.inPorts.add('in', {
    datatype: 'all',
    description: 'Trigger'
  });
  c.outPorts.add('out', {
    datatype: 'all'
  });
  c.process(function (input, output) {
    // Check preconditions on input data
    if (!input.hasData('in')) {
      return;
    }
    // Read packets we need to process
    var overrides = input.getData('in');

    // Process data and send output
    const out = wren.inputs(overrides);
    output.send({
      out: out,
    });
    // Deactivate
    output.done();
  });
  return c;
};

