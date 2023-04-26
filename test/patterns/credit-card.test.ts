import { creditCard } from '../../src/patterns/credit-card'
import { testPattern } from '../utils/test-pattern'

testPattern({
	name: 'creditCard',
	pattern: creditCard,
	validCases: [
		// NOTE: If a test case here is commented out,
		// it existed in the validators.js test cases but I cannot find any
		// corroboration that it should be considered valid.
		'375556917985515',
		'36050234196908',
		'4716461583322103',
		'4716221051885662',
		'4929722653797141',
		'5398228707871527',
		'6283875070985593',
		'6263892624162870',
		//'6234917882863855',
		//'6234698580215388',
		'6226050967750613',
		'6246281879460688',
		'2222155765072228',
		'2225855203075256',
		'2720428011723762',
		'2718760626256570',
		// '6765780016990268',
		// '4716989580001715211',
		'8171999927660000',
		// '8171999900000000021',
	],
	invalidCases: [
		'foo',
		'foo',
		// this is only invalid per checksum
		// '5398228707871528',
		// this is only invalid per checksum
		// '2718760626256571',
		'2721465526338453',
		'2220175103860763',
		'375556917985515999999993',
		'899999996234917882863855',
		'prefix6234917882863855',
		'623491788middle2863855',
		'6234917882863855suffix',
		'4716989580001715213',
	],
})
