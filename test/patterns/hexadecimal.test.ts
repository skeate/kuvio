import { hexadecimal } from '../../src/patterns/hexadecimal'
import { testPattern } from '../utils/test-pattern'

testPattern({
	name: 'hexadecimal',
	pattern: hexadecimal,
	validCases: [
		'deadBEEF',
		'ff0044',
		'0xff0044',
		'0XfF0044',
		'0x0123456789abcDEF',
		'0X0123456789abcDEF',
		'0hfedCBA9876543210',
		'0HfedCBA9876543210',
		'0123456789abcDEF',
	],
	invalidCases: [
		'abcdefg',
		'',
		'..',
		'0xa2h',
		'0xa20x',
		'0x0123456789abcDEFq',
		'0hfedCBA9876543210q',
		'01234q56789abcDEF',
	],
})
