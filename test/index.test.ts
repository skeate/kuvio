import { describe, it, expect } from 'vitest'
import * as k from '../src/index'

describe('kuvio', () => {
	it('exports foo', () => {
		expect(k.foo).toBe('bar')
	})
})
