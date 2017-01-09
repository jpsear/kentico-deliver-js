class KenticoDeliverAPI {
	constructor(projectId) {
		if (typeof projectId !== 'string') {
			throw new Error(`KenticoDeliverAPI must be instantiated with a Project ID`)
		}
		
		this.query = {
			values: [`/items?`]
		}

		return this;
	}

	run() {
		return new Promise((resolve, reject) => {
			// Kentico fetch will go here
			resolve(this.query)
		})
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

const _id = (id) => {
	if (typeof id !== 'string') {
		throw new Error(`id must be passed as a string`)
	}
	if (id.indexOf(' ') >= 0) {
		throw new Error(`id must not contain spaces`)
	}
	return `&system.id=${id}&`;
}

const _name = (name) => {
	if (typeof name !== 'string') {
		throw new Error(`name must be passed as a string`)
	}
	return `&system.name=${encodeURIComponent(name)}&`;
};

const _codeName = (codeName) => {
	if (typeof codeName !== 'string') {
		throw new Error(`codeName must be passed as a string`)
	}
	if (codeName.indexOf(' ') >= 0) {
		throw new Error(`codeName must not contain spaces`)
	}
	return `&system.codename=${codeName}&`;
};

const _type = (type) =>  {
	if (typeof type !== 'string') {
		throw new Error(`type must be passed as a string`)
	}
	return `&system.type=${encodeURIComponent(type)}&`;
};

const _sitemapLocation = (sitemapLocation) => {
	if (typeof sitemapLocation !== 'string') {
		throw new Error(`sitemapLocation must be passed as a string`)
	}
	return `&system.sitemap_locations[contains]=${encodeURIComponent(sitemapLocation)}&`
};

const _lastModified = (lastModified) => {
	if (!lastModified instanceof Date) {
		throw new Error(`lastModified must be passed as a Date object`)
	}
	return `&system.last_modified=${lastModified}&`;
};

const _published = (published) => {
	if (typeof published !== 'boolean') {
		throw new Error(`published must be passed as a boolean value`)
	}
}

export default KenticoDeliverAPI;
