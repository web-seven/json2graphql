const fetch = require('node-fetch');
const throwError = require('./error');
const {cli} = require('cli-ux');

const trackTables = async (tables, url, headers) => {
  const bulkQueryArgs = [];
  tables.forEach(table => {
    bulkQueryArgs.push({
      type: 'add_existing_table_or_view',
      args: {
        name: table.name,
        schema: 'public',
      },
    });
  });
  const bulkQuery = {
    type: 'bulk',
    args: bulkQueryArgs,
  };
  const resp = await fetch(
    `${url}/v1/query`,
    {
      method: 'POST',
      body: JSON.stringify(bulkQuery),
      headers,
    }
  );
  if (resp.status !== 200) {
    const error = await resp.json();
    cli.action.start(error.error);
  }
};

module.exports = {
  trackTables,
};
