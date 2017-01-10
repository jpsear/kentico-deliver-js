import { publishedContent, unpublishedContent } from './config/endpoints';
import 'isomorphic-fetch';

class KenticoDeliverAPI {
  /**
   * Instantiates the KenticoDeliverAPI class
   * @constructor
   * @param {string} Kentico Your Project ID.
   */
  constructor(projectId, previewAPIKey) {
    if (typeof projectId !== 'string') {
      throw new Error(`KenticoDeliverAPI must be instantiated with a Project ID`)
    }
    
    this.uriEndpoint = `items`;
    this.projectId = projectId;
    this.previewAPIKey = previewAPIKey;
    this.defaults = { 	
      values: [],
      published: true,
      queryText: ''
    }
    this._initAndResetQuery();

    return this;
  }

  /**
   * Returns one item of the given system id.
   * @param {string} id - The id of the resource
   * @param {string} operator - The operator to filter the resource by (lt, lte, gt, gte, in, contains, range)
   */
  id(id, operator) {
    return this._handler(id, _parseOperator(operator, 'id'), _id);
  }

  /**
   * Returns one item of the given system name.
   * @param {string} name - The name of the resource
   * @param {string} operator - The operator to filter the resource by (lt, lte, gt, gte, in, contains, range)
   */
  name(name, operator) {
    return this._handler(name, _parseOperator(operator, 'name'), _name);
  }

  /**
   * Returns one item of the given system codename.
   * @param {string} codeName - The codeName of the resource
   * @param {string} operator - The operator to filter the resource by (lt, lte, gt, gte, in, contains, range)
   */
  codeName(codeName, operator) {
    return this._handler(codeName, _parseOperator(operator, 'codeName'), _codeName);
  }

  /**
   * Returns items of the given system content type.
   * @param {string} type - The content type of the resource
   * @param {string} operator - The operator to filter the resource by (lt, lte, gt, gte, in, contains, range)
   */
  type(type, operator) {
    return this._handler(type, _parseOperator(operator, 'type'), _type);
  }

  /**
   * Returns items in the given sitemap location.
   * @param {string} sitemapLocation - The sitemap location of the resource
   * @param {string} operator - The operator to filter the resource by (lt, lte, gt, gte, in, contains, range)
   */
  sitemapLocation(sitemapLocation, operator) {
    return this._handler(sitemapLocation, _parseOperator(operator, 'sitemapLocation'), _sitemapLocation);
  }

  /**
   * Returns items matching the given last modified date
   * @param {Date} lastModified - The last modified date of the resource
   * @param {string} operator - The operator to filter the resource by (lt, lte, gt, gte, in, contains, range)
   */
  lastModified(lastModified, operator) {
    return this._handler(lastModified, _parseOperator(operator, 'lastModified'), _lastModified);
  }

  /**
   * Filters the dataset to return either published or unpublished content
   * @param {Boolean} published - Whether the content is published or not
   * @param {string} operator - The operator to filter the resource by (lt, lte, gt, gte, in, contains, range)
   */
  published(published, previewAPIKey = '') {
    this.query = Object.assign(this.query, this.query.published = _published(published, this.previewAPIKey));
    return this;
  }


  /**
   * Runs the provided query. Must be supplied at the end of the chain
   * @return {Promise} The dataset.
   */
  run() {
    return new Promise((resolve, reject) => {
      this.query.queryText = _combineQueryValues(this.query.values);

      this._fetchData(this.query, resolve, reject)
        .then(result => {
          this._initAndResetQuery();
          resolve(result);
        })
        .catch(error => {
          this._initAndResetQuery();
          reject(error)
        })
    })
  }

  /**
   * A debug method for seeing what your query object looks like
   * @return {Promise} The query object as the result of the promise.
   */
  queryDebug() {
    return new Promise((resolve, reject) => {
      this.query.queryText = _combineQueryValues(this.query.values);
      resolve(this.query);
      this._initAndResetQuery();
    })
  }

  /**
   * Fetches the data from Kentico Deliver/Cloud using the `fetch` package
   * @private 
   * @param {object} query - The query object
   * @param {function} resolve - The function to call once data has been received
   * @param {function} reject - The function to call if an error occurs
   */
  _fetchData(query, resolve, reject) {
    const { queryText, published } = this.query;
    const fullQuery = `${this.projectId}/${this.uriEndpoint}?${queryText}`;

    if (!query.published) {
      return fetch(`${unpublishedContent}/${fullQuery}`, 
        { 
          headers: { Authorization: `Bearer ${this.previewAPIKey}` }
        }
      )
        .then(result => resolve(result.json()))
        .catch(error => reject(error))
    }
    else {
      return fetch(`${publishedContent}/${fullQuery}`)
        .then(result => resolve(result.json()))
        .catch(error => reject(error))
    }
  }

  /**
   * Processes the request for the resource and adds it our the array of queries, as a string
   * @private 
   * @param {string} value - The value wanted for the query
   * @param {string} operator - The operator to filter the query with
   * @param {function} fn - The function to be called to manipulate the query string content
   */
  _handler(val, operator, fn) {
    this.query = Object.assign(this.query, this.query.values.push(fn(val, operator)));
    return this;
  }

  /**
   * Resets the query object to the default properties
   * @private 
   */
  _initAndResetQuery() {
    return this.query = Object.assign({}, this.defaults);
  }
}

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

export default KenticoDeliverAPI;
