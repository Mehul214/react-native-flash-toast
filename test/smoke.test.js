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
        loop: (anim) => ({ start: (cb) => cb && cb(), stop: () => {} }),
      },
      Easing: {
        linear: (t) => t,
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

const {
  FlashMessage,
  showMessage,
  hideMessage,
  flashManager,
  COLORS,
  BuiltInIcon,
  setColorTheme,
  setCustomColors,
  resolveTheme,
  resetColorThemes,
} = require('../dist/index.js');

console.log('Testing exports...');
assert(FlashMessage, 'FlashMessage should be defined');
assert(typeof showMessage === 'function', 'showMessage should be a function');
assert(typeof hideMessage === 'function', 'hideMessage should be a function');
assert(flashManager, 'flashManager should be defined');
assert(COLORS.success.background === '#059669', 'COLORS.success should match');
assert(COLORS.info.background === '#2563EB', 'COLORS.info should match');
assert(typeof BuiltInIcon === 'function', 'BuiltInIcon should be exported');

console.log('Testing custom themes & color registry...');
setColorTheme('purple', {
  background: '#7C3AED',
  text: '#FFFFFF',
  icon: '#DDD6FE',
});
const purpleTheme = resolveTheme('purple');
assert.strictEqual(purpleTheme.background, '#7C3AED', 'Custom purple theme background should match');
assert.strictEqual(purpleTheme.icon, '#DDD6FE', 'Custom purple theme icon color should match');

resetColorThemes();
const fallbackTheme = resolveTheme('purple');
assert.strictEqual(fallbackTheme.background, COLORS.default.background, 'Should fallback to default after reset');

console.log('Testing manager buffer queue...');
let called = false;
showMessage({
  message: 'Custom styled toast',
  description: 'With custom colors and icon',
  backgroundColor: '#4F46E5',
  color: '#EEF2FF',
  descriptionColor: '#C7D2FE',
  iconColor: '#FBBF24',
  iconBadgeColor: 'rgba(251, 191, 36, 0.2)',
  icon: 'star',
  iconPosition: 'right',
  borderColor: '#818CF8',
  borderWidth: 2,
  borderRadius: 24,
});

flashManager.register({
  showMessage: (opts) => {
    called = true;
    assert.strictEqual(opts.message, 'Custom styled toast');
    assert.strictEqual(opts.backgroundColor, '#4F46E5');
    assert.strictEqual(opts.icon, 'star');
    assert.strictEqual(opts.iconPosition, 'right');
  },
  hideMessage: () => {},
});

assert.strictEqual(called, true, 'Buffered message should have been delivered upon registration');

console.log('✅ All smoke tests passed successfully!');
