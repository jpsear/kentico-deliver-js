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

	it('should return an id query without an operator', () => {
		const id = '123';
		const expected = '&system.id=123';
		expect(_id(id)).to.equal(expected);
	})
})
