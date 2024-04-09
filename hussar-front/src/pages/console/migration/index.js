import { register } from 'hussar-migration';

function initialize() {
  const context = require.context('./', true, /plugin\.js$/, 'sync');
  for (const key of context.keys()) {
    const plugin = context(key).default;
    register(plugin);
  }
}
initialize();
