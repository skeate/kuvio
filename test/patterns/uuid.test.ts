import {
	anyUUID,
	uuidV1,
	uuidV2,
	uuidV3,
	uuidV4,
	uuidV5,
} from '../../src/patterns/uuid'
import { testPattern } from '../test-utils/test-pattern'

const valid = {
	1: ['E034B584-7D89-11E9-9669-1AECF481A97B'],
	2: ['A987FBC9-4BED-2078-CF07-9141BA07C9F3'],
	3: ['A987FBC9-4BED-3078-CF07-9141BA07C9F3'],
	4: [
		'713ae7e3-cb32-45f9-adcb-7c4fa86b90c1',
		'625e63f3-58f5-40b7-83a1-a72ad31acffb',
		'57b73598-8764-4ad0-a76a-679bb6640eb1',
		'9c858901-8a57-4791-81fe-4c455b099bc9',
	],
	5: [
		'987FBC97-4BED-5078-AF07-9141BA07C9F3',
		'987FBC97-4BED-5078-BF07-9141BA07C9F3',
		'987FBC97-4BED-5078-8F07-9141BA07C9F3',
		'987FBC97-4BED-5078-9F07-9141BA07C9F3',
	],
	any: [
		'A987FBC9-4BED-3078-CF07-9141BA07C9F3',
		'A117FBC9-4BED-3078-CF07-9141BA07C9F3',
		'A127FBC9-4BED-3078-CF07-9141BA07C9F3',
	],
}

const invalid = {
	1: [
		'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
		'AAAAAAAA-1111-2222-AAAG',
		'AAAAAAAA-1111-2222-AAAG-111111111111',
		'A987FBC9-4BED-4078-8F07-9141BA07C9F3',
		'A987FBC9-4BED-5078-AF07-9141BA07C9F3',
	],
	2: [
		'',
		'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
		'11111',
		'AAAAAAAA-1111-1111-AAAG-111111111111',
		'A987FBC9-4BED-4078-8F07-9141BA07C9F3',
		'A987FBC9-4BED-5078-AF07-9141BA07C9F3',
	],
	3: [
		'',
		'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
		'934859',
		'AAAAAAAA-1111-1111-AAAG-111111111111',
		'A987FBC9-4BED-4078-8F07-9141BA07C9F3',
		'A987FBC9-4BED-5078-AF07-9141BA07C9F3',
	],
	4: [
		'',
		'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
		'934859',
		'AAAAAAAA-1111-1111-AAAG-111111111111',
		'A987FBC9-4BED-5078-AF07-9141BA07C9F3',
		'A987FBC9-4BED-3078-CF07-9141BA07C9F3',
	],
	5: [
		'',
		'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
		'934859',
		'AAAAAAAA-1111-1111-AAAG-111111111111',
		'9c858901-8a57-4791-81fe-4c455b099bc9',
		'A987FBC9-4BED-3078-CF07-9141BA07C9F3',
	],
	any: [
		'',
		'xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3',
		'A987FBC9-4BED-3078-CF07-9141BA07C9F3xxx',
		'A987FBC94BED3078CF079141BA07C9F3',
		'934859',
		'987FBC9-4BED-3078-CF07A-9141BA07C9F3',
		'AAAAAAAA-1111-1111-AAAG-111111111111',
	],
}

testPattern({
	name: 'uuid v1',
	pattern: uuidV1,
	validCases: valid['1'],
	invalidCases: invalid['1'],
})
testPattern({
	name: 'uuid v2',
	pattern: uuidV2,
	validCases: valid['2'],
	invalidCases: invalid['2'],
})
testPattern({
	name: 'uuid v3',
	pattern: uuidV3,
	validCases: valid['3'],
	invalidCases: invalid['3'],
})
testPattern({
	name: 'uuid v4',
	pattern: uuidV4,
	validCases: valid['4'],
	invalidCases: invalid['4'],
})
testPattern({
	name: 'uuid v5',
	pattern: uuidV5,
	validCases: valid['5'],
	invalidCases: invalid['5'],
})
testPattern({
	name: 'any uuid',
	pattern: anyUUID,
	validCases: [
		...valid['1'],
		...valid['2'],
		...valid['3'],
		...valid['4'],
		...valid['5'],
		...valid.any,
	],
	invalidCases: invalid.any,
})
