import Element from '../../src/Element';

describe('Example', () => {
  describe('property', () => {
    test.todo('TODO');
    async () => {
      const element = Element.fromString<
        HTMLDivElement,
        {
          foo: [string, number, HTMLElement];
        }
      >('<div></div>');

      element.on('foo', ({ detail: [a, b, c] }) => {
        const s: string[] = [a],
          n: number[] = [b],
          e: Node[] = [c];
      });

      element.on('keydown', (event) => {
        event.key;
      });
    };
  });
});
