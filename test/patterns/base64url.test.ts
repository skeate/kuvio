import { base64Url } from '../../src/patterns/base64url'
import { testPattern } from '../test-utils/test-pattern'

testPattern({
	name: 'base64url',
	pattern: base64Url,
	validCases: [
		'',
		'bGFkaWVzIGFuZCBnZW50bGVtZW4sIHdlIGFyZSBmbG9hdGluZyBpbiBzcGFjZQ',
		'1234',
		'bXVtLW5ldmVyLXByb3Vk',
		'PDw_Pz8-Pg',
		'VGhpcyBpcyBhbiBlbmNvZGVkIHN0cmluZw',
	],
	invalidCases: [
		' AA',
		'\tAA',
		'\rAA',
		'\nAA',
		'This+isa/bad+base64Url==',
		'0K3RgtC+INC30LDQutC+0LTQuNGA0L7QstCw0L3QvdCw0Y8g0YHRgtGA0L7QutCw',
	],
})
