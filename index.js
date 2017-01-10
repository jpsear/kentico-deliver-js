import { publishedContent, unpublishedContent } from './config/endpoints';
import 'isomorphic-fetch';

class KenticoDeliverAPI {
	/**
	 * Instantiates the KenticoDeliverAPI class
	 * @param {string} Kentico Your Project ID.
	 */
	constructor(projectId) {
		if (typeof projectId !== 'string') {
			throw new Error(`KenticoDeliverAPI must be instantiated with a Project ID`)
		}
		this.query = { 
			uriEndpoint: `items`,
			values: [],
			published: true,
			projectId
		}
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
		return this._handler(codeName, _parseOperator(operator, 'codeName'),_codeName);
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
	 * @param {Bool} published - Whether the content is published or not
	 * @param {string} operator - The operator to filter the resource by (lt, lte, gt, gte, in, contains, range)
	 */
	published(published) {
		this.query = Object.assign(this.query, this.query.published = _published(published));
		return this;
	}

	_fetchData(query, resolve, reject) {
		const { queryText, uriEndpoint, projectId } = this.query;

		if (!query.published) {
			// fetch unpublished data
		}
		else {
			return fetch(`${publishedContent}/${projectId}/${uriEndpoint}?${queryText}`)
				.then(result => { 
					resolve(result.json()) 
				})
				.catch(error => {
					reject(error)
				})
		}
	}

	_handler(val, operator, fn) {
		this.query = Object.assign(this.query, this.query.values.push(fn(val, operator)));
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
				.then(result => resolve(result))
				.catch(error => reject(error))
		})
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

const _published = (published) => {
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
