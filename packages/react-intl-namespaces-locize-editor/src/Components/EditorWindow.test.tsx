import { mount } from 'enzyme';
import * as React from 'react';
import { Editor } from './Editor';
import { EditorWindow } from './EditorWindow';

function delay(timeout: number = 0) {
  return new Promise<void>(resolve => {
    window.setTimeout(resolve, timeout);
  });
}

const options: Editor.RequiredProps = {
  apiKey: '6b9ac145-b395-47dc-bcc4-001398c4c843',
  language: 'en',
  projectId: '2592abb8-1129-457d-a06b-836745d33c55',
  referenceLanguage: 'en',
};
describe('EditorWindow', () => {
  it('should show panel in iframe mode', async () => {
    const PropsMock = jest.fn<EditorWindow.Props>(() => ({
      onOpen: jest.fn(async (callback: Promise<EditorWindow.PostMessage>) => {
        await delay(10);
        const postMessage = await callback;
        postMessage({ someMessageData: 'data' }, 'target');
      }),
    }));

    const propsMock = new PropsMock();

    const wrapper = mount(
      <EditorWindow
        url="some url"
        editorWidthInPixels={100}
        mode="iframe"
        {...propsMock}
      />,
    );

    expect(wrapper.html()).toMatchSnapshot();

    expect(propsMock).toMatchSnapshot();
  });

  it('should show panel in window mode', async done => {
    const OpenedWindowMock = jest.fn<Window>(() => ({
      focus: jest.fn(),
      postMessage: jest.fn(),
    }));

    const WindowMock = jest.fn<Window>(() => ({
      open: jest.fn<Window>(() => openedWindowMock),
    }));

    const PropsMock = jest.fn<EditorWindow.Props>(() => ({
      onOpen: jest.fn(async (callback: Promise<EditorWindow.PostMessage>) => {
        const postMessage = await callback;
        postMessage({ someMessageData: 'data' }, 'target');
      }),
      window: windowMock,
    }));

    const openedWindowMock = new OpenedWindowMock();
    const windowMock = new WindowMock();
    const propsMock = new PropsMock();

    const wrapper = mount(
      <EditorWindow
        editorWidthInPixels={100}
        windowOpenTimeout={0}
        mode="window"
        url="some-url"
        {...propsMock}
      />,
    );

    await delay(10);
    expect(wrapper.html()).toMatchSnapshot();

    expect(propsMock).toMatchSnapshot();
    expect(windowMock).toMatchSnapshot();
    expect(openedWindowMock).toMatchSnapshot();
    done();
  });
});
