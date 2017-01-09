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
			projectId
		}
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

	/**
	 * Returns one item of the given system id.
	 * @param {string} id - The id of the resource
	 */
	id(id) {
		return this._handler(id, _id);
	}

	/**
	 * Returns one item of the given system name.
	 * @param {string} name - The name of the resource
	 */
	name(name) {
		return this._handler(name, _name);
	}

	/**
	 * Returns one item of the given system codename.
	 * @param {string} codeName - The codeName of the resource
	 */
	codeName(codeName) {
		return this._handler(codeName, _codeName);
	}

	/**
	 * Returns items of the given system content type.
	 * @param {string} type - The content type of the resource
	 */
	type(type) {
		return this._handler(type, _type);
	}

	/**
	 * Returns items in the given sitemap location.
	 * @param {string} sitemapLocation - The sitemap location of the resource
	 */
	sitemapLocation(sitemapLocation) {
		return this._handler(sitemapLocation, _sitemapLocation);
	}

	/**
	 * Returns items matching the given last modified date
	 * @param {Date} lastModified - The last modified date of the resource
	 */
	lastModified(lastModified) {
		return this._handler(lastModified, _lastModified);
	}

	/**
	 * Filters the dataset to return either published or unpublished content
	 * @param {Bool} published - Whether the content is published or not
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

	_handler(val, fn) {
		this.query = Object.assign(this.query, this.query.values.push(fn(val)));
		return this;
	}
}

const _combineQueryValues = (values) => {
	return values.join('');
}

const _id = (id) => {
	if (typeof id !== 'string') {
		throw new Error(`id must be passed as a string`)
	}
	if (id.indexOf(' ') >= 0) {
		throw new Error(`id must not contain spaces`);
	}
	return `&system.id=${id}`;
}

const _name = (name) => {
	if (typeof name !== 'string') {
		throw new Error(`name must be passed as a string`)
	}
	return `&system.name=${encodeURIComponent(name)}`;
};

const _codeName = (codeName) => {
	if (typeof codeName !== 'string') {
		throw new Error(`codeName must be passed as a string`)
	}
	if (codeName.indexOf(' ') >= 0) {
		throw new Error(`codeName must not contain spaces`);
	}
	return `&system.codename=${codeName}`;
};

const _type = (type) =>  {
	if (typeof type !== 'string') {
		throw new Error(`type must be passed as a string`);
	}
	return `&system.type=${encodeURIComponent(type)}`;
};

const _sitemapLocation = (sitemapLocation) => {
	if (typeof sitemapLocation !== 'string') {
		throw new Error(`sitemapLocation must be passed as a string`)
	}
	return `&system.sitemap_locations[contains]=${encodeURIComponent(sitemapLocation)}`;
};

const _lastModified = (lastModified) => {
	if (!lastModified instanceof Date) {
		throw new Error(`lastModified must be passed as a Date object`);
	}
	return `&system.last_modified=${lastModified}`;
};

const _published = (published) => {
	if (typeof published !== 'boolean') {
		throw new Error(`published must be passed as a boolean value`);
	}
	if (published === undefined) {
		return true;
	}
	return published;
}

export default KenticoDeliverAPI;
