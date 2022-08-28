import { getRawProperty } from '../lib/getProperties';

describe('typescript-library', () => {
  describe('feature', () => {
    it('should be possible to launch a browser and check the page contents', async () => {
      await page.goto('about:blank');

      await expect(
        (
          await getRawProperty<HTMLBodyElement, 'tagName'>(
            page.$('body'),
            'tagName'
          )
        ).toLowerCase()
      ).toBe('body');
    });
  });
});
