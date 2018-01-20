import { getDomPath } from './utils';

describe('utils', () => {
  it('should getDomPath produce path in document', () => {
    document.body.innerHTML = `
<span>
  <span>
    <span id="id1">1</span>
  </span>
  <span>
    <span id="id2">2</span>
  </span>
  <span>
    <span id="id3">3</span>
  </span>
</span>
    `;

    const path = getDomPath(document.getElementById('id3'));
    expect(path).toBe('/SPAN[0]/SPAN[2]/SPAN[0]');
  });
});
