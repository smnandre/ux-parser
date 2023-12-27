export type Token = [type: TokenType, value: string, position: number];

export const enum TokenType {
    BRACKET = 'BRA',        // BRACKET          ( ) [ ] { }
    NUMBER = 'NUM',         // NUMBER           123 123.45 .45 0.45 -123 -123.45 -.45 -0.45
    PUNCTUATION = 'PUN',    // PUNCTUATION      . , ; : ? !
    STRING = 'STR',         // STRING
    SYMBOL = 'SYM',         // SYMBOL
    WHITESPACE = 'WSP'      // WHITESPACE
}

export class TokenList {
    private position = 0;

    constructor(private tokens: Token[]) {
    }

    next(): Token | null {
        return this.tokens[this.position++];
    }

    hasNext(): boolean {
        return this.position < this.tokens.length;
    }

    peek(): Token | null {
        return this.tokens[this.position];
    }

    get eof(): boolean {
        return this.position >= this.tokens.length;
    }
}
