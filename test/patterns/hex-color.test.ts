import { hexColor } from '../../src/patterns/hex-color'
import { testPattern } from '../test-utils/test-pattern'

testPattern({
	name: 'hexColor',
	pattern: hexColor,
	validCases: ['#ff0000ff', '#ff0034', '#CCCCCC', '0f38', 'fff', '#f00'],
	invalidCases: ['#ff', 'fff0a', '#ff12FG', '#bbh'],
})
