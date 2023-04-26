import { rgbColor } from '../../src/patterns/rgb-color'
import { testPattern } from '../utils/test-pattern'

testPattern({
	name: 'rgbColor',
	pattern: rgbColor,
	validCases: [
		'rgb(0,0,0)',
		'rgb(255,255,255)',
		'rgba(0,0,0,0)',
		'rgba(255,255,255,1)',
		'rgba(255,255,255,.1)',
		'rgba(255,255,255,0.1)',
		'rgba(255,255,255,.12)',
		'rgb(5%,5%,5%)',
		'rgba(5%,5%,5%,.3)',
	],

	invalidCases: [
		'rgb(0,0,0,)',
		'rgb(0,0,)',
		'rgb(0,0,256)',
		'rgb()',
		'rgba(0,0,0)',
		'rgba(255,255,255,2)',
		'rgba(255,255,256,0.1)',
		'rgb(4,4,5%)',
		'rgba(5%,5%,5%)',
		'rgba(3,3,3%,.3)',
		'rgb(101%,101%,101%)',
		'rgba(3%,3%,101%,0.3)',
	],
})
