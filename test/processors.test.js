import chai from 'chai';
import { _combineQueryValues, _id, _name, _codeName, _type, _sitemapLocation, _lastModified, _published, _parseOperator } from '../src/processors';

describe('Processor tests', () => {
	const expect = chai.expect;

	it('should take an array of query values and join them, without spaces', () => {
		const query = {
			values: ['param1&', 'param2&', 'param3']
		}
		const expected = 'param1&param2&param3';
		expect(_combineQueryValues(query.values)).to.equal(expected);
	})

	it('should return a system.id query without an operator', () => {
		const expected = '&system.id=123';
		expect(_id('123')).to.equal(expected);
	})

	it('should return a system.id query with an operator', () => {
		const expected = '&system.id[lt]=123';
		expect(_id('123', 'lt')).to.equal(expected);
	})

	it('should return a system.type query that is encoded, without an operator', () => {
		const expected = '&system.type=some%20type';
		expect(_type('some type')).to.equal(expected);
	})

	it('should return a system.type query that is encoded, with an operator', () => {
		const expected = '&system.type[contains]=some%20type';
		expect(_type('some type', 'contains')).to.equal(expected);
	})

	it('should return a system.sitemap_locations query that is encoded, without an operator', () => {
		const expected = '&system.sitemap_locations=About%20Us';
		expect(_sitemapLocation('About Us')).to.equal(expected);
	})

	it('should return a system.sitemap_locations query that is encoded, with an operator', () => {
		const expected = '&system.sitemap_locations[contains]=About%20Us';
		expect(_sitemapLocation('About Us', 'contains')).to.equal(expected);
	})

	it('should return a system.last_modified query without an operator', () => {
		const date = new Date();
		const expected = `&system.last_modified=${date}`;
		expect(_lastModified(date)).to.equal(expected);
	})

	it('should return a system.last_modified query with an operator', () => {
		const date = new Date();
		const expected = `&system.last_modified[lt]=${date}`;
		expect(_lastModified(date, 'lt')).to.equal(expected);
	})

	it('should return a true published status', () => {
		expect(_published(true)).to.equal(true);
	})

	it('should return a false published status when passing a preview API key', () => {
		expect(_published(false, 'my-preview-api-key')).to.equal(false);
	})

	it('should throw an error when passing a false published status and not passing a preview API key', () => {
		expect(() => _published(false)).to.throw(Error);
	})
})
