import { publishedContent, unpublishedContent } from './config/endpoints';
import 'isomorphic-fetch';

class KenticoDeliverAPI {
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

	run() {
		return new Promise((resolve, reject) => {
			this.query.queryText = _combineQueryValues(this.query.values);

			this.fetchData(this.query, resolve, reject)
				.then(result => resolve(result))
				.catch(error => reject(error))
		})
	}

	fetchData(query, resolve, reject) {
		const { queryText, uriEndpoint, projectId } = this.query;

		if (!query.published) {
			// fetch unpublished data
		}
		else {
			console.log(`${publishedContent}/${projectId}/${uriEndpoint}?${queryText}`);
			return fetch(`${publishedContent}/${projectId}/${uriEndpoint}?${queryText}`)
				.then(result => { 
					resolve(result.json()) 
				})
				.catch(error => {
					reject(error)
				})
		}
	}

	handler(val, fn) {
		this.query = Object.assign(this.query, this.query.values.push(fn(val)));
		return this;
	}

	id(id) {
		return this.handler(id, _id);
	}

	name(name) {
		return this.handler(name, _name);
	}

	codeName(codeName) {
		return this.handler(codeName, _codeName);
	}

	type(type) {
		return this.handler(type, _type);
	}

	sitemapLocation(sitemapLocation) {
		return this.handler(sitemapLocation, _sitemapLocation);
	}

	lastModified(lastModified) {
		return this.handler(lastModified, _lastModified);
	}

	published(published) {
		this.query = Object.assign(this.query, this.query.published = _published(published));
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
