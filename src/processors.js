const _combineQueryValues = (values) => {
  return values.join('');
}

const _id = (id, operator) => {
  if (typeof id !== 'string') {
    throw new Error(`id must be passed as a string`)
  }
  if (id.indexOf(' ') >= 0) {
    throw new Error(`id must not contain spaces`);
  }
  return `&system.id${operator}=${id}`;
}

const _name = (name, operator) => {
  if (typeof name !== 'string') {
    throw new Error(`name must be passed as a string`)
  }
  return `&system.name${operator}=${encodeURIComponent(name)}`;
};

const _codeName = (codeName, operator) => {
  if (typeof codeName !== 'string') {
    throw new Error(`codeName must be passed as a string`)
  }
  if (codeName.indexOf(' ') >= 0) {
    throw new Error(`codeName must not contain spaces`);
  }
  return `&system.codename${operator}=${codeName}`;
};

const _type = (type, operator) =>  {
  if (typeof type !== 'string') {
    throw new Error(`type must be passed as a string`);
  }
  return `&system.type${operator}=${encodeURIComponent(type)}`;
};

const _sitemapLocation = (sitemapLocation, operator) => {
  if (typeof sitemapLocation !== 'string') {
    throw new Error(`sitemapLocation must be passed as a string`);
  }
  return `&system.sitemap_locations${operator}=${encodeURIComponent(sitemapLocation)}`;
};

const _lastModified = (lastModified, operator) => {
  if (!lastModified instanceof Date) {
    throw new Error(`lastModified must be passed as a Date object`);
  }
  return `&system.last_modified${operator}=${lastModified}`;
};

const _published = (published, previewAPIKey) => {
  if (published === false && previewAPIKey === undefined) {
    throw new Error(`To fetch unpublished content, you must supply a Preview API Key`);
  }

  if (typeof published !== 'boolean') {
    throw new Error(`published must be passed as a boolean value`);
  }
  return published;
}

const _parseOperator = (operator, fnCalled) => {

  if (operator === undefined) {
    return '';
  }

  switch (operator.toLowerCase()) {
    case 'lt': 
    return '[lt]';

    case 'lessthan':
    return '[lt]';

    case 'lte': 
    return '[lte]';

    case 'lessthanorequal': 
    return '[lte]';

    case 'lessthanorequalto': 
    return '[lte]';

    case 'gt': 
    return '[gt]';

    case 'greaterthan': 
    return '[gt]';

    case 'gte': 
    return '[gte]';

    case 'greaterthanorequal': 
    return '[gte]';

    case 'greaterthanorequalto': 
    return '[gte]';

    case 'range': 
    return '[range]';

    case 'ranging': 
    return '[range]';

    case 'in': 
    return '[in]';

    case 'contains': 
    return '[contains]';
    
    default:
    throw new Error(`Unrecognised operator in ${fnCalled}`);
  }
}

export { _combineQueryValues, _id, _name, _codeName, _type, _sitemapLocation, _lastModified, _published, _parseOperator }
