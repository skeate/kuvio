import { base64 } from '../../src/patterns/base64'
import { testPattern } from '../test-utils/test-pattern'

testPattern({
	name: 'base64',
	pattern: base64,
	validCases: [
		'',
		'Zg==',
		'Zm8=',
		'Zm9v',
		'Zm9vYg==',
		'Zm9vYmE=',
		'Zm9vYmFy',
		'TG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdC4=',
		'Vml2YW11cyBmZXJtZW50dW0gc2VtcGVyIHBvcnRhLg==',
		'U3VzcGVuZGlzc2UgbGVjdHVzIGxlbw==',
		'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuMPNS1Ufof9EW/M98FNw' +
			'UAKrwflsqVxaxQjBQnHQmiI7Vac40t8x7pIb8gLGV6wL7sBTJiPovJ0V7y7oc0Ye' +
			'rhKh0Rm4skP2z/jHwwZICgGzBvA0rH8xlhUiTvcwDCJ0kc+fh35hNt8srZQM4619' +
			'FTgB66Xmp4EtVyhpQV+t02g6NzK72oZI0vnAvqhpkxLeLiMCyrI416wHm5Tkukhx' +
			'QmcL2a6hNOyu0ixX/x2kSFXApEnVrJ+/IxGyfyw8kf4N2IZpW5nEP847lpfj0SZZ' +
			'Fwrd1mnfnDbYohX2zRptLy2ZUn06Qo9pkG5ntvFEPo9bfZeULtjYzIl6K8gJ2uGZ' +
			'HQIDAQAB',
	],
	invalidCases: [
		'12345',
		'Vml2YW11cyBmZXJtZtesting123',
		'Zg=',
		'Z===',
		'Zm=8',
		'=m9vYg==',
		'Zm9vYmFy====',
	],
})
