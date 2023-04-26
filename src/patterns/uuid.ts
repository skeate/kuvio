import { char, characterClass, exactly, sequence } from '../base'
import { hexDigit } from '../character-classes'

const nHexDigits = (n: number) => exactly(n)(hexDigit)

export const uuidV1 = sequence(
	nHexDigits(8),
	char('-'),
	nHexDigits(4),
	char('-'),
	char('1'),
	nHexDigits(3),
	char('-'),
	nHexDigits(4),
	char('-'),
	nHexDigits(12),
)

export const uuidV2 = sequence(
	nHexDigits(8),
	char('-'),
	nHexDigits(4),
	char('-'),
	char('2'),
	nHexDigits(3),
	char('-'),
	nHexDigits(4),
	char('-'),
	nHexDigits(12),
)

export const uuidV3 = sequence(
	nHexDigits(8),
	char('-'),
	nHexDigits(4),
	char('-'),
	char('3'),
	nHexDigits(3),
	char('-'),
	nHexDigits(4),
	char('-'),
	nHexDigits(12),
)

export const uuidV4 = sequence(
	nHexDigits(8),
	char('-'),
	nHexDigits(4),
	char('-'),
	char('4'),
	nHexDigits(3),
	char('-'),
	characterClass(false, 'A', 'a', 'B', 'b', '8', '9'),
	nHexDigits(3),
	char('-'),
	nHexDigits(12),
)

export const uuidV5 = sequence(
	nHexDigits(8),
	char('-'),
	nHexDigits(4),
	char('-'),
	char('5'),
	nHexDigits(3),
	char('-'),
	characterClass(false, 'A', 'a', 'B', 'b', '8', '9'),
	nHexDigits(3),
	char('-'),
	nHexDigits(12),
)

export const anyUUID = sequence(
	nHexDigits(8),
	char('-'),
	nHexDigits(4),
	char('-'),
	nHexDigits(4),
	char('-'),
	nHexDigits(4),
	char('-'),
	nHexDigits(12),
)
