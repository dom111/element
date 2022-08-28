import Element from '../../src/Element';

describe('Example', () => {
  describe('property', () => {
    test.todo('TODO', async () => {
      const element = Element.fromString<
        HTMLDivElement,
        {
          foo: [string, number, HTMLElement];
        }
      >('<div></div>');

      element.on('foo', (event) => {
        const [a, b, c] = event.detail;

        // Error on unsupported types
        document.body.append(a, b, c);
      });
    });
  });
});
