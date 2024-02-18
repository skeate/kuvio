import { jwt } from '../../src/patterns/jwt'
import { testPattern } from '../test-utils/test-pattern'

testPattern({
	name: 'jwt',
	pattern: jwt,
	validCases: [
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkaWQiOiJ5b3UiLCJyZWFsbHkiOiJqdXN0IiwiZGVjb2RlIjoidGhpcz8iLCJ3b3ciOjEzMzd9.wlKUhamhmhW60ZRztn7Fz2lhXN1YWRQ2O2VIGhibDtU',
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb3JlbSI6Imlwc3VtIn0.ymiJSsMJXR6tMSr8G9usjQ15_8hKPDv_CArLhxw28MI',
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb2xvciI6InNpdCIsImFtZXQiOlsibG9yZW0iLCJpcHN1bSJdfQ.rRpe04zbWbbJjwM43VnHzAboDzszJtGrNsUxaqQ-GQ8',
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqb2huIjp7ImFnZSI6MjUsImhlaWdodCI6MTg1fSwiamFrZSI6eyJhZ2UiOjMwLCJoZWlnaHQiOjI3MH19.YRLPARDmhGMC3BBk_OhtwwK21PIkVCqQe8ncIRPKo-E',
		// No signature
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ',
	],

	invalidCases: [
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqb2huIjp7ImFnZSI6MjUsImhlaWdodCI6MTg1fSwiamFrZSI6eyJhZ2UiOjMwLCJoZWlnaHQiOjI3MH19.YRLPARDmhGMC3BBk_OhtwwK21PIkVCqQe8ncIRPKo-E.YRLPARDmhGMC3BBk_OhtwwK21PIkVCqQe8ncIRPKo-E',
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqb2huIjp7ImFnZSI6MjUsImhlaWdodCI6MTg1fSwiamFrZSI6eyJhZ2UiOjMwLCJoZWlnaHQiOjI3MH19.YRLPARDmhGMC3BBk_OhtwwK21PIkVCqQe8ncIRPKo-E.YRLPARDmhGMC3BBk_OhtwwK21PIkVCqQe8ncIRPKo-E.YRLPARDmhGMC3BBk_OhtwwK21PIkVCqQe8ncIRPKo-E',
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
		'$Zs.ewu.su84',
		'ks64$S/9.dy$§kz.3sd73b',
	],
})
