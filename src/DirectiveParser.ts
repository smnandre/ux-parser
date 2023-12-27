import {Directive, Action, Modifier, Argument} from "./Directive";
import {TokenType} from "./Token";
import {tokenize} from "./Tokenizer";

/**
 * Parses strings like "addClass(foo) removeAttribute(bar)"
 * into an array of directives, with this format:
 *
 *      [
 *          { action: {name: "addClass", args: [{value: "foo"}]}, modifiers: []},
 *          { action: {name: "removeAttribute", args: [{value: "bar"}]}, modifiers: []},
 *      ]
 *
 * This also handles named arguments
 *
 *      save(foo=bar, baz=bars)
 *
 * Which would return:
 *      [
 *          { action: {name: "save", args: [{name: 'foo', value: 'bar'}, {name: 'baz', value: 'bars'}]}, modifiers: []},
 *      ]
 *
 *
 * Exemple:
 *    addClass(foo)
 *      => { action: {name: "addClass", args: [{value: "foo"}]}, modifiers: [] }
 *
 *    delay|addClass(foo)
 *     => {
 *          action: {name: "addClass", args: [{value: "foo"}]},
 *          modifiers: [{name: "delay", args: []}]
 *        }
 *
 * @param {string} content The value of the attribute
 */
export function parseDirectives(content: string|null): Directive[] {
    if (!content) {
        return [];
    }
    const tokens = tokenize(content);

    let position = 0;

    const directives: Directive[] = [];

    consumeWhitespace();
    while (!eof()) {
        let directive = parseDirective();
        if (null === directive) {
            break;
        }
        directives.push(directive);
        consumeWhitespace();
    }

    return directives;

    function parseDirective(): Directive | null {
        const modifiers: Modifier[] = [];
        let action = parseAction();
        if (null === action) {
            return null;
        }
        if (eof()) {
            return {
                action: action,
                modifiers: modifiers
            }
        }

        if (isTypeValue(TokenType.PUNCTUATION, '|')) {
            position ++;
            // TODO test arguments!
            modifiers.push(action);
            if (eof()) {
                throw new Error(`Unexpected end of string`);
            }
            action = parseAction();
            if (null === action) {
                throw new Error(`Unexpected token ${tokenType()}`);
            }
        }
        return {
            action: action,
            modifiers: modifiers
        }
    }

    function eof(): boolean {
        return position >= tokens.length;
    }

    function parseAction(): Action | null {
        if (!isType(TokenType.SYMBOL)) {
            return null;
        }
        const action = tokenValue();
        if (action === null) {
            return null;
        }
        position ++;
        const args = eof() ? [] :  parseArguments();
        return {
            name: action,
            args: args
        }
    }

    function consumeWhitespace() {
        while (!eof() && isType(TokenType.WHITESPACE)) {
            position++;
        }
    }

    function tokenValue(): string {

        let value = tokens[position][1];

        if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, value.length - 1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
            value = value.slice(1, value.length - 1);
        }

        return value;
    }

    function tokenType(): TokenType {
        return tokens[position][0];
    }
    function isType(type: TokenType): boolean {
        return type === tokenType();
    }
    function isTypeValue(type: TokenType, value: string): boolean {
        return isType(type) && isValue(value);
    }
    function isValue(value: string): boolean {
        return value === tokenValue();
    }

    function parseArguments(): Argument[] {
        let args: Argument[] = [];

        if (!isTypeValue(TokenType.BRACKET, '(')) {
            return args;
        }
        // Ignore the opening parenthesis
        position++;

        while(!isTypeValue(TokenType.BRACKET, ')')) {
            consumeWhitespace();
            // Expect string or identifier or number
            if (!isType(TokenType.STRING) && !isType(TokenType.SYMBOL) && !isType(TokenType.NUMBER)) {
                throw new Error(`Unexpected token ${tokenType()}`);
            }
            // Extract one argument
            let arg = {
                value: tokenValue(),
                type: isType(TokenType.NUMBER) ? 'number' : 'string'
            };
            position ++;
            // Whitespace(s)
            consumeWhitespace();
            // Colon ?
            if (isTypeValue(TokenType.PUNCTUATION, ':')) {
                position ++;
                consumeWhitespace();
                if (!isType(TokenType.STRING) && !isType(TokenType.SYMBOL) && !isType(TokenType.NUMBER)) {
                    throw new Error(`Unexpected token ${tokenType()}`);
                }
                arg = Object.assign(arg, {
                    name: arg.value,
                    value: tokenValue(),
                    type: isType(TokenType.NUMBER) ? 'number' : 'string'
                });
                position ++;
            }
            args.push(arg);

            // Allow trailing comma
            if (isTypeValue(TokenType.PUNCTUATION, ',')) {
                position ++;
            }
            // TODO end?
        }

        // Ignore the closing parenthesis
        position++;

        return args;
    }
}
