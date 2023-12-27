import { parseDirectives } from '../src/DirectiveParser';

describe('parseDirectives', () => {
    it('should return an empty array when content is null', () => {
        const result = parseDirectives(null);
        expect(result).to.be.an('array').that.is.empty;
    });

    it('should parse a single directive with no arguments', () => {
        const result = parseDirectives('addClass');
        expect(result).to.deep.equal([
            { action: {name: 'addClass', args: []}, modifiers: [] }
        ]);
    });

    it('should parse directive with parenthesis inside quoted argument', () => {
        const result = parseDirectives('foo("bar(baz)")');
        expect(result).to.deep.equal([
            { action: {name: 'foo', args: [{value: 'bar(baz)', type: 'string'}]}, modifiers: [] }
        ]);
    });

    it('should parse a single directive with one number argument', () => {
        const result = parseDirectives('addClass(200)');
        expect(result).to.deep.equal([
            { action: {name: 'addClass', args: [{value: '200', type:'number'}]}, modifiers: [] }
        ]);
    });

    it('should parse a single directive with one string argument', () => {
        const result = parseDirectives('addClass(200)');
        expect(result).to.deep.equal([
            { action: {name: 'addClass', args: [{value: '200', type:'number'}]}, modifiers: [] }
        ]);
    });

    it('should parse a single directive with one single-quoted argument', () => {
        const result = parseDirectives("addClass('fooBar')");
        expect(result).to.deep.equal([
            { action: {name: 'addClass', args: [{value: 'fooBar', type:'string'}]}, modifiers: [] }
        ]);
    });

    it('should parse a single directive with one double-quoted argument', () => {
        const result = parseDirectives('addClass("fooBar")');
        expect(result).to.deep.equal([
            { action: {name: 'addClass', args: [{value: 'fooBar', type:'string'}]}, modifiers: [] }
        ]);
    });

     it('should parse a single directive with a modifier', () => {
        const result = parseDirectives('foo|bar');
        expect(result).to.deep.equal([{
            action: {name: 'bar', args: []},
            modifiers: [{ name: 'foo', args: [] }]
        }]);
    });

      it('should parse a single directive with an argument and a modifier', () => {
        const result = parseDirectives('foo|bar(baz)');
        expect(result).to.deep.equal([{
            action: {name: 'bar', args: [{value: 'baz', type: "string"}]},
            modifiers: [{ name: 'foo', args: [] }]
        }]);
    });

    it('should parse a single directive with a modifier with an argument', () => {
        const result = parseDirectives('delay(500)|addClass');
        expect(result).to.deep.equal([{
            action: {name: 'addClass', args: []},
            modifiers: [{ name: 'delay', args: [{value: "500", type: "number"}] }]
        }]);
    });


     it('should parse a directive with argument and a modifier with an argument', () => {
        const result = parseDirectives('foo(200)|bar(blop)');
        expect(result).to.deep.equal([{
            action: {name: 'bar', args: [{value: 'blop', type: "string"}]},
            modifiers: [{ name: 'foo', args: [{value: "200", type: "number"}] }]
        }]);
    });

     it('should parse two directives with argument and a modifier with an argument', () => {
        const result = parseDirectives('foo(200)|bar(blop) foo(200)|bar(blop)');
        expect(result).to.deep.equal([{
            action: {name: 'bar', args: [{value: 'blop', type: "string"}]},
            modifiers: [{ name: 'foo', args: [{value: "200", type: "number"}] }]
        }, {
            action: {name: 'bar', args: [{value: 'blop', type: "string"}]},
            modifiers: [{ name: 'foo', args: [{value: "200", type: "number"}] }]
        }]);
    });

    it('should parse a single directive with unnamed arguments', () => {
        const result = parseDirectives('addClass(foo, bar)');
        expect(result).to.deep.equal([
            { action: {name: 'addClass', args: [{value:'foo', type:'string'}, {value:'bar',type:'string'}]}, modifiers: [] }
        ]);
    });

    it('should parse a single directive with one named argument', () => {
        const result = parseDirectives('save(foo: bar)');
        expect(result).to.deep.equal([
            { action: {name: 'save', args: [{name: 'foo', value: 'bar',type: 'string' }]}, modifiers: [] }
        ]);
    });

    it('should parse a single directive with two named argument', () => {
        const result = parseDirectives('save(foo: bar, baz: 200)');
        expect(result).to.deep.equal([
            { action: {name: 'save', args: [{name: 'foo', value: 'bar',type: 'string' }, {name: 'baz', value: '200', type: 'number' }]}, modifiers: [] }
        ]);
    });

    it('should parse multiple directives', () => {
        const result = parseDirectives('addClass(foo) removeAttribute(bar)');
        expect(result).to.deep.equal([
            { action: {name: 'addClass', args: [{value: 'foo', type: 'string'}]}, modifiers: [] },
            { action: {name: 'removeAttribute', args: [{value: 'bar', type: 'string'}]}, modifiers: [] },
        ]);
    });

    it('should throw an error when arguments are not closed', () => {
        expect(() => parseDirectives('addClass(foo')).to.throw(Error, 'Did you forget to add a closing ")" after "addClass"?');
    });

    it('should throw an error when mixing normal and named arguments', () => {
        expect(() => parseDirectives('save(foo, bar=baz)')).to.throw(Error, 'Normal and named arguments cannot be mixed inside "save()"');
    });

    it('should throw an error when a modifier has multiple arguments', () => {
        expect(() => parseDirectives('addClass(foo) | modifier(bar, baz)')).to.throw(Error, 'The modifier "modifier()" does not support multiple arguments.');
    });

    it('should throw an error when a modifier has named arguments', () => {
        expect(() => parseDirectives('addClass(foo) | modifier(bar=baz)')).to.throw(Error, 'The modifier "modifier()" does not support named arguments.');
    });
});
