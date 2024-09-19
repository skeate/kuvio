/**
 * NOTE: This pattern can check certain aspects of a credit card number, but not
 * all. Specifically, credit card numbers often use a [Luhn
 * checksum](https://en.wikipedia.org/wiki/Luhn_algorithm) to verify that the
 * number is valid. This pattern does not check that checksum, so it will accept
 * some invalid credit card numbers.
 *
 * If you want Luhn checksum validation, you can use the
 * [`schemata-ts`](https://github.com/jacob-alford/schemata-ts) library.
 */
import {
	andThen,
	between,
	char,
	characterClass,
	exactString,
	exactly,
	or,
	sequence,
	subgroup,
} from '../base'
import { digit } from '../character-classes'
import { oneOf } from '../combinators'
import { pipe } from '../util/pipe'

// source: https://en.wikipedia.org/w/index.php?title=Payment_card_number&oldid=1110892430
// afaict the 13-digit variant has not been a thing for years, but maybe there
// are still some valid cards floating around?
// /(^4(\d{12}|\d{15})$)/
const visa = pipe(
	char('4'),
	andThen(pipe(exactly(12)(digit), or(exactly(15)(digit)), subgroup)),
)

// source: https://web.archive.org/web/20180514224309/https://www.mastercard.us/content/dam/mccom/global/documents/mastercard-rules.pdf
// /(^(5[1-5]\d{4}|222[1-9]\d{2}|22[3-9]\d{3}|2[3-6]\d{4}|27[01]\d{3}|2720\d{2})\d{10}$)/
const mastercard = pipe(
	subgroup(
		pipe(
			sequence(char('5'), characterClass(false, ['1', '5']), exactly(4)(digit)),
			or(
				sequence(
					exactString('222'),
					characterClass(false, ['1', '9']),
					exactly(2)(digit),
				),
			),
			or(
				sequence(
					exactString('22'),
					characterClass(false, ['3', '9']),
					exactly(3)(digit),
				),
			),
			or(
				sequence(
					exactString('2'),
					characterClass(false, ['3', '6']),
					exactly(4)(digit),
				),
			),
			or(
				sequence(
					exactString('27'),
					characterClass(false, '0', '1'),
					exactly(3)(digit),
				),
			),
			or(sequence(exactString('2720'), exactly(2)(digit))),
		),
	),
	andThen(exactly(10)(digit)),
)

// source: https://web.archive.org/web/20210504163517/https://www.americanexpress.com/content/dam/amex/hk/en/staticassets/merchant/pdf/support-and-services/useful-information-and-downloads/GuidetoCheckingCardFaces.pdf
// /(^3[47]\d{13}$)/
const amex = sequence(
	char('3'),
	characterClass(false, '4', '7'),
	exactly(13)(digit),
)

// US/Canada DCI cards will match as Mastercard (source: https://web.archive.org/web/20081204135437/http://www.mastercard.com/in/merchant/en/solutions_resources/dinersclub.html)
// Others match regex below (source: https://web.archive.org/web/20170822221741/https://www.discovernetwork.com/downloads/IPP_VAR_Compliance.pdf)
// /^(3(0([0-5]\d{5}|95\d{4})|[89]\d{6})\d{8,11}|36\d{6}\d{6,11})$/
const dinersClub = pipe(
	sequence(
		char('3'),
		subgroup(
			pipe(
				sequence(
					char('0'),
					subgroup(
						pipe(
							sequence(characterClass(false, ['0', '5']), exactly(5)(digit)),
							or(sequence(exactString('95'), exactly(4)(digit))),
						),
					),
				),
				or(sequence(characterClass(false, '8', '9'), exactly(6)(digit))),
			),
		),
		between(8, 11)(digit),
	),
	or(sequence(exactString('36'), exactly(6)(digit), between(6, 11)(digit))),
	subgroup,
)

// source: https://web.archive.org/web/20170822221741/https://www.discovernetwork.com/downloads/IPP_VAR_Compliance.pdf
// /(^(6011(0[5-9]\d{2}|[2-4]\d{3}|74\d{2}|7[7-9]\d{2}|8[6-9]\d{2}|9\d{3})|64[4-9]\d{5}|650[0-5]\d{4}|65060[1-9]\d{2}|65061[1-9]\d{2}|6506[2-9]\d{3}|650[7-9]\d{4}|65[1-9]\d{5})\d{8,11}$)/,
const discover = pipe(
	oneOf(
		pipe(
			exactString('6011'),
			andThen(
				subgroup(
					oneOf(
						sequence(
							char('0'),
							characterClass(false, ['5', '9']),
							exactly(2)(digit),
						),
						sequence(characterClass(false, ['2', '4']), exactly(3)(digit)),
						sequence(exactString('74'), exactly(2)(digit)),
						sequence(
							exactString('7'),
							characterClass(false, ['7', '9']),
							exactly(2)(digit),
						),
						sequence(
							exactString('8'),
							characterClass(false, ['6', '9']),
							exactly(2)(digit),
						),
						sequence(exactString('9'), exactly(3)(digit)),
					),
				),
			),
		),
		sequence(
			exactString('64'),
			characterClass(false, ['4', '9']),
			exactly(5)(digit),
		),
		sequence(
			exactString('650'),
			characterClass(false, ['0', '5']),
			exactly(4)(digit),
		),
		sequence(
			exactString('65060'),
			characterClass(false, ['1', '9']),
			exactly(2)(digit),
		),
		sequence(
			exactString('65061'),
			characterClass(false, ['1', '9']),
			exactly(2)(digit),
		),
		sequence(
			exactString('6506'),
			characterClass(false, ['2', '9']),
			exactly(3)(digit),
		),
		sequence(
			exactString('650'),
			characterClass(false, ['7', '9']),
			exactly(4)(digit),
		),
		sequence(
			exactString('65'),
			characterClass(false, ['1', '9']),
			exactly(5)(digit),
		),
	),
	subgroup,
	andThen(between(8, 11)(digit)),
)

// /^(352[89]\d{4}|35[3-8]\d{5})\d{8,11}$/
const jcb = pipe(
	sequence(
		exactString('352'),
		characterClass(false, '8', '9'),
		exactly(4)(digit),
	),
	or(
		sequence(
			exactString('35'),
			characterClass(false, ['3', '8']),
			exactly(5)(digit),
		),
	),
	subgroup,
	andThen(between(8, 11)(digit)),
)

// Rupay
// some are JCB co-branded so will match as JCB above
// for the rest, best source I could find is just wikipedia:
// https://en.wikipedia.org/w/index.php?title=Payment_card_number&oldid=1110892430
// /^((60|65|81|82)\d{14}|508\d{14})$/
const rupay = subgroup(
	oneOf(
		sequence(
			subgroup(
				oneOf(
					exactString('60'),
					exactString('65'),
					exactString('81'),
					exactString('82'),
				),
			),
			exactly(14)(digit),
		),
		sequence(exactString('508'), exactly(14)(digit)),
	),
)

// /^62(2(12[6-9]\d{2}|1[3-9]\d{3}|[2-8]\d|9[01]\d{3}|92[0-5]\d{2})|[4-6]\d{5}|8[2-8]\d{4})\d{8,11}$/
const unionPay = sequence(
	exactString('62'),
	subgroup(
		oneOf(
			sequence(
				char('2'),
				subgroup(
					oneOf(
						sequence(
							exactString('12'),
							characterClass(false, ['6', '9']),
							exactly(2)(digit),
						),
						sequence(
							char('1'),
							characterClass(false, ['3', '9']),
							exactly(3)(digit),
						),
						sequence(characterClass(false, ['2', '8']), digit),
						sequence(
							exactString('9'),
							characterClass(false, '0', '1'),
							exactly(3)(digit),
						),
						sequence(
							exactString('92'),
							characterClass(false, ['0', '5']),
							exactly(2)(digit),
						),
					),
				),
			),
			sequence(characterClass(false, ['4', '6']), exactly(5)(digit)),
			sequence(
				exactString('8'),
				characterClass(false, ['2', '8']),
				exactly(4)(digit),
			),
		),
	),
	between(8, 11)(digit),
)

/**
 * @since 1.1.0
 * @category Pattern
 */
export const creditCard = oneOf(
	visa,
	mastercard,
	amex,
	dinersClub,
	discover,
	jcb,
	rupay,
	unionPay,
)
