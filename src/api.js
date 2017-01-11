import { publishedContent, unpublishedContent } from './config/endpoints';
import { _combineQueryValues, _id, _name, _codeName, _type, _sitemapLocation, _lastModified, _published, _parseOperator } from './processors';
import 'isomorphic-fetch';

/**
 * @module KenticoDeliverAPI
 * @example
 * 
 * // Get all items of content type `drinks`
 * import KenticoCloudAPI from 'kentico-deliver-js';
 * 
 * const api = new KenticoCloudAPI('Project-ID');
 * 
 * let items;
 * 
 * api
 * .type('drinks')
 * .run()
 * .then(result => console.info(result, 👌))
 * .catch(error => console.warn(error))
 * 
 */

class KenticoDeliverAPI {
  /**
   * Instantiates the KenticoDeliverAPI class
   * @constructor
   * @param {string} Kentico Your Project ID.
   */
  constructor(projectId, previewAPIKey) {
    if (typeof projectId !== 'string' || projectId === undefined) {
      throw new Error(`KenticoDeliverAPI must be instantiated with a Project ID`)
    }

    if (previewAPIKey && typeof previewAPIKey !== 'string') {
      throw new Error(`KenticoDeliverAPI Preview API Key must be a string`)
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
    return this._handler(id, operator, _id);
  }

  /**
   * Returns one item of the given system name.
   * @param {string} name - The name of the resource
   * @param {string} operator - The operator to filter the resource by (lt, lte, gt, gte, in, contains, range)
   */
  name(name, operator) {
    return this._handler(name, operator, _name);
  }

  /**
   * Returns one item of the given system codename.
   * @param {string} codeName - The codeName of the resource
   * @param {string} operator - The operator to filter the resource by (lt, lte, gt, gte, in, contains, range)
   */
  codeName(codeName, operator) {
    return this._handler(codeName, operator, _codeName);
  }

  /**
   * Returns items of the given system content type.
   * @param {string} type - The content type of the resource
   * @param {string} operator - The operator to filter the resource by (lt, lte, gt, gte, in, contains, range)
   */
  type(type, operator) {
    return this._handler(type, operator, _type);
  }

  /**
   * Returns items in the given sitemap location.
   * @param {string} sitemapLocation - The sitemap location of the resource
   * @param {string} operator - The operator to filter the resource by (lt, lte, gt, gte, in, contains, range)
   */
  sitemapLocation(sitemapLocation, operator) {
    return this._handler(sitemapLocation, operator, _sitemapLocation);
  }

  /**
   * Returns items matching the given last modified date
   * @param {Date} lastModified - The last modified date of the resource
   * @param {string} operator - The operator to filter the resource by (lt, lte, gt, gte, in, contains, range)
   */
  lastModified(lastModified, operator) {
    return this._handler(lastModified, operator, _lastModified);
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
   * Pass a raw query (not recommended). Example: 'system.id=123'
   * @param {string} query - The query content
   */
  dangerousQuery(query) {
    if (typeof query !== 'string') {
      throw new Error(`dangerousQuery must be passed a string`);
    }
    return this._handler(query, '', () => query);
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
   * @param {string} val - The value wanted for the query
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

export default KenticoDeliverAPI;
