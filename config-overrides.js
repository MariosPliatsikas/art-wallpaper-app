const path = require('path');

module.exports = function override(config, env) {
  // Βρείτε τον κανόνα για το source-map-loader και εξαιρέστε όλα τα node modules
  config.module.rules.forEach(rule => {
    if (rule.enforce === 'pre' && rule.use && rule.use.some(loader => loader.loader === 
'source-map-loader')) {
      rule.exclude = /node_modules/;
    }
  });

  return config;
};
