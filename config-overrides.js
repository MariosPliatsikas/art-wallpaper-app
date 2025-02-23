
const path = require('path');

module.exports = function override(config, env) {
  // Βρείτε τον κανόνα για το source-map-loader
  const sourceMapRule = config.module.rules.find(
    (rule) =>
      rule.enforce === 'pre' &&
      rule.use &&
      rule.use.some((loader) => loader.loader === 'source-map-loader')
  );

  // Αν βρεθεί ο κανόνας, εξαιρέστε τα node_modules
  if (sourceMapRule) {
    sourceMapRule.exclude = /node_modules/;
  } else {
    console.warn('Source map loader rule not found!');
  }

  return config;
};