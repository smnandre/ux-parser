import {Token, TokenType} from "./Token";

/**
 * STRING
 *  OK:
 *    ""                // empty string
 *    " "               // empty string with whitespace
 *    "\s\n\t"          // empty string with whitespaces
 *    "foo"
 *    "foo'
 *    "foo\"bar"
 *    "foo'bar"         // single quotes inside double quotes
 *    'foo"bar'         // double quotes inside single quotes
 *    "foo\nbar"        // string containing newline
 *    "foo), (foo: {o"  // string containing punctuation
 *    "$var"            // string containing dollar sign
 *    "fo 🐻‍ o"         // string containing emoji
 *
 *  NOT OK:
 *    "foo              // unterminated string
 *    "foo\"
 *    'foo
 *    "foo "bar"
 *    "foo'             // non-matching quotes
 */
const PATTERN_STRING = /^("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*')/;

/**
 * NUMBER
 * OK:
 *   123
 *   123.45
 *   .45
 *   0.45
 *   -123
 *   -123.45
 *   -.45
 *   -0.45
 * NOK:
 *  00
 *  -00
 *  45.
 *  45.67.89
 *  -12-0
 */
const PATTERN_NUMBER = /^([-+]?(?:\d+\.\d*|\.\d+|\d+))/;

/**
 * BRACKET
 *  OK: ( ) [ ] { }
 */
const PATTERN_BRACKET = /^[\(\)\[\]\{\}]/;

/**
 * PUNCTUATION
 *  OK: . , ; : ? !
 */
const PATTERN_PUNCTUATION = /^[.,;:?!|]/;

const PATTERN_SYMBOL = /^[a-zA-Z0-9_]+/;

const PATTERN_WHITESPACE = /^\s+/;

type TypeMatcher = [TokenType, RegExp];

export function tokenize(str: string): Token[] {

    // Replace newlines, tabs and carriage returns with spaces
    str = str.replace(/[\r\n\t]/, ' ');

    // The order is important as some pattern overlap with others
    const tokenizers: TypeMatcher[] = [
        [TokenType.STRING, PATTERN_STRING],
        [TokenType.WHITESPACE, PATTERN_WHITESPACE],
        [TokenType.BRACKET, PATTERN_BRACKET],
        [TokenType.NUMBER, PATTERN_NUMBER],
        [TokenType.PUNCTUATION, PATTERN_PUNCTUATION],
        [TokenType.SYMBOL, PATTERN_SYMBOL],
    ];
    let tokens: Token[] = [];
    let position = 0;
    while ('' !== str) {
        let match = null;
        for (let [type, pattern] of tokenizers) {
            match = str.match(pattern);
            if (match) {
                let val = match[0];
                tokens.push([type, val, position]);
                position += val.length;
                str = str.slice(val.length);
                break;
            }
        }
        if (!match) {
            throw new Error(`Unexpected token ${str[0]} at position ${position}`);
        }
    }
    return tokens;
}



