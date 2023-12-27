import {Token, TokenType} from '../src/Token';
import {tokenize} from '../src/Tokenizer';

describe('Tokenizer', () => {

    it('should handle empty input', () => {
        const tokens: Token[] = tokenize("");
        expect(tokens).to.deep.equal([]);
    });

    describe.concurrent('Token types', () => {
        const typeCases = {
            [TokenType.SYMBOL]: ['foo', '_var', 'fooBar', 'foo_bar', 'fooBar123', 'foo_bar_123',],
            [TokenType.NUMBER]: ['123', '0', '123.45', '.45', '0.45', '-123', '-123.45', '-.45', '-0.45'],
            [TokenType.BRACKET]: ['(', ')', '{', '}', '[', ']'],
            [TokenType.PUNCTUATION]: [',', ':', '|'],
            [TokenType.STRING]: ['""', "''", `"'"`,],
        }
        Object.entries(typeCases).forEach(([type, inputs]) => {
            describe(`${type} tokens`, () => {
                inputs.forEach((input) => {
                    it(`should tokenize ${input} as a ${type} token`, () => {
                        const tokens: Token[] = tokenize(input);
                        expect(tokens).to.deep.equal([
                            [type as keyof typeof TokenType, input, 0]
                        ]);
                    });
                });
            });
        });
    });

    describe('Directives', () => {

        it('should tokenize strings correctly', () => {
            expect(tokenize('foo bar')).to.deep.equal([
                [TokenType.SYMBOL, 'foo', 0],
                [TokenType.WHITESPACE, ' ', 3],
                [TokenType.SYMBOL, 'bar', 4],
            ]);
        });

        it('should tokenize strings correctly', () => {
            const tokens = tokenize("foo(bar: 123, baz: 'qux')");
            expect(tokens).to.deep.equal([
                [TokenType.SYMBOL, 'foo', 0],
                [TokenType.BRACKET, '(', 3],
                [TokenType.SYMBOL, 'bar', 4],
                [TokenType.PUNCTUATION, ':', 7],
                [TokenType.WHITESPACE, ' ', 8],
                [TokenType.NUMBER, '123', 9],
                [TokenType.PUNCTUATION, ',', 12],
                [TokenType.WHITESPACE, ' ', 13],
                [TokenType.SYMBOL, 'baz', 14],
                [TokenType.PUNCTUATION, ':', 17],
                [TokenType.WHITESPACE, ' ', 18],
                [TokenType.STRING, "'qux'", 19],
                [TokenType.BRACKET, ')', 24],
            ]);
        });

    });

    describe('Errors', () => {
        it('should handle unexpected input', () => {
            expect(() => tokenize("foo £")).to.throw(Error, 'Unexpected token £ at position 4');
        });
    });

});
