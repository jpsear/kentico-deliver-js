import chai from 'chai';
import KenticoDeliverAPI from '../src/api';

describe('API tests', (done) => {
  const expect = chai.expect;

  it('should throw an error when instantiated without a Project ID', () => {
		expect(() => new KenticoDeliverAPI()).to.throw(Error);
  })

  it('should throw an error when instantiated with an invalid Project ID', () => {
		expect(() => new KenticoDeliverAPI(123)).to.throw(Error);
  })

  it('should throw an error when Preview API Key is not a string', () => {
		expect(() => new KenticoDeliverAPI('123', 123)).to.throw(Error);
  })

  it('should return a query with a system.type and a less than operator ', done => {
		const api = new KenticoDeliverAPI('123');
		const expected = '&system.type[lt]=some_type';

		api
			.type('some_type', 'lessThan')
			.queryDebug()
			.then(result => {
				try {
					expect(result.queryText).to.equal(expected);
					expect(result.published).to.equal(true);
					done();
				}
				catch(error) { done(error) }
			});
  })

  it('should return a query with a system.id with no operator ', done => {
		const api = new KenticoDeliverAPI('123');
		const expected = '&system.id=321';

		api
			.id('321')
			.queryDebug()
			.then(result => {
				try {
					expect(result.queryText).to.equal(expected);
					expect(result.published).to.equal(true);
					done();
				}
				catch(error) { done(error) }
			});
  })
})
