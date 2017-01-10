import chai from 'chai';
import KenticoDeliverAPI from '../src/api';

describe('API tests', () => {
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
})
