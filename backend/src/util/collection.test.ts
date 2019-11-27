import { makeArray } from './collection';

describe('util - collection', () => {
    test('makeArray number', () => {
        let a: number = 5
        let b: number[] = [5, 8, 10]
        expect(makeArray(a)).toStrictEqual([a])
        expect(makeArray(b)).toStrictEqual(b)
    })

    test('makeArray string', () => {
        let a: string = 'test'
        let b: string[] = ['ee', 'rrr', 'iiii']
        expect(makeArray(a)).toStrictEqual([a])
        expect(makeArray(b)).toStrictEqual(b)
    })

    test('makeArray class', () => {
        class Dummy {
            private aa: number
            private bb: string
            constructor(aa: number, bb: string) {
                this.aa = aa
                this.bb = bb
            }
        }

        let a = new Dummy(10, 'sdfas')
        let b = [a, new Dummy(20, 'dd'), new Dummy(40, 'eee')]
        expect(makeArray(a)).toStrictEqual([a])
        expect(makeArray(b)).toStrictEqual(b)
    })
})