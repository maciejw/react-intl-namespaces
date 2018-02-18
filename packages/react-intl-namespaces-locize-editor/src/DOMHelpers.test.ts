import { DOMHelpers } from './DOMHelpers';

describe('DomHelpers', () => {
  const WindowMock = jest.fn<Window>(({ closed = false } = {}) => ({
    closed,
    focus: jest.fn(),
    open: jest.fn(),
    postMessage: jest.fn(),
  }));

  it('should focus', () => {
    const windowMock = new WindowMock();

    DOMHelpers.EditorWindow.focus(windowMock);

    expect(windowMock).toMatchSnapshot();
  });

  it('should post message', () => {
    const windowMock = new WindowMock();

    DOMHelpers.EditorWindow.postMessage(
      windowMock,
      { message: 'value' },
      'some-target',
      ['transfer', 'params'],
    );

    expect(windowMock).toMatchSnapshot();
  });
  it('should open window after delay if its closed', async () => {
    const windowMock = new WindowMock({ closed: true });

    const openedWindow = await DOMHelpers.EditorWindow.openIfNecessary(
      windowMock,
      windowMock,
      0,
      'some-url',
      'some-target',
      'some-feature',
      true,
    );

    expect(windowMock).toMatchSnapshot();
  });
  it('should not locate resource context when target is not html element', () => {
    const result = DOMHelpers.Editor.locateResourceContext(document);
    expect(result).toBe(false);
  });

  it('should not find in dom hierarchy when parent element is null', () => {
    const divWithoutParent = document.createElement('div');
    const result = DOMHelpers.Editor.findElementInDOMHierarchy(
      divWithoutParent,
      e => false,
    );
    expect(result).toBe(false);
  });
  it('should quit searching in dom hierarchy when body is reached', () => {
    const divWithoutParent = document.createElement('div');

    const filterMock = jest.fn();
    const result = DOMHelpers.Editor.findElementInDOMHierarchy(
      document.body,
      filterMock,
    );
    expect(result).toBe(false);
    expect(filterMock).not.toBeCalled();
  });
});
