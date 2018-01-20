import { LocizeEditorBinding } from './locizeEditorBinding';

const x = new LocizeEditorBinding({
  backend: {
    apiKey: '',
    projectId: '',
    referenceLng: '',
  },
});

describe('LocizeEditorBinding', () => {
  it('should behave...', () => {
    expect(1).toBe(1);
  });
});
