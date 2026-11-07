const assert = require('assert');
const Module = require('module');

// Mock react-native for Node test environment
const originalRequire = Module.prototype.require;
Module.prototype.require = function (id) {
  if (id === 'react-native') {
    return {
      Platform: { OS: 'ios', select: (obj) => obj.ios || obj.default },
      Dimensions: { get: () => ({ width: 390, height: 844 }) },
      StatusBar: { currentHeight: 44 },
      StyleSheet: {
        create: (styles) => styles,
        hairlineWidth: 1,
      },
      Animated: {
        Value: class {
          constructor(v) { this.val = v; }
          setValue(v) { this.val = v; }
          interpolate() { return this; }
        },
        timing: () => ({ start: (cb) => cb && cb() }),
        spring: () => ({ start: (cb) => cb && cb() }),
        parallel: (anims) => ({ start: (cb) => cb && cb() }),
      },
      PanResponder: {
        create: () => ({ panHandlers: {} }),
      },
      View: 'View',
      Text: 'Text',
      Pressable: 'Pressable',
    };
  }
  return originalRequire.apply(this, arguments);
};

const { FlashMessage, showMessage, hideMessage, flashManager, COLORS } = require('../dist/index.js');

console.log('Testing exports...');
assert(FlashMessage, 'FlashMessage should be defined');
assert(typeof showMessage === 'function', 'showMessage should be a function');
assert(typeof hideMessage === 'function', 'hideMessage should be a function');
assert(flashManager, 'flashManager should be defined');
assert(COLORS.success.background === '#059669', 'COLORS.success should match');

console.log('Testing manager buffer queue...');
let called = false;
showMessage({ message: 'Early message before mount', type: 'info' });

flashManager.register({
  showMessage: (opts) => {
    called = true;
    assert.strictEqual(opts.message, 'Early message before mount');
  },
  hideMessage: () => {},
});

assert.strictEqual(called, true, 'Buffered message should have been delivered upon registration');

console.log('✅ All smoke tests passed successfully!');
