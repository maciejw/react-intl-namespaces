import { mount, ReactWrapper } from 'enzyme';
import * as React from 'react';
import {
  FormattedMessage,
  IntlBackendProvider,
  IntlNamespaceProvider,
} from 'react-intl-namespaces';

function delay(timeout: number = 0) {
  return new Promise<void>(resolve => {
    window.setTimeout(resolve, timeout);
  });
}

import { DOMHelpers } from '../DOMHelpers';
import { Editor, EditorComponent } from './Editor';
import { EditorPanel } from './EditorPanel';
import { EditorWindow } from './EditorWindow';

const app = document.createElement('div');
app.id = 'app';

const app1 = document.createElement('div');
app1.id = 'app';
const app2 = document.createElement('div');
app2.id = 'app';

const options: Editor.RequiredProps = {
  apiKey: '6b9ac145-b395-47dc-bcc4-001398c4c843',
  language: 'en',
  projectId: '2592abb8-1129-457d-a06b-836745d33c55',
  referenceLanguage: 'en',
};
describe('Editor', () => {
  function createMocks() {
    const BodyMock = jest.fn<HTMLBodyElement>(() => ({
      addEventListener: jest.fn((type, listener) =>
        document.body.addEventListener(type, listener),
      ),
      appendChild: jest.fn(newChild => document.body.appendChild(newChild)),
      removeChild: jest.fn(oldChild => document.body.removeChild(oldChild)),
      removeEventListener: jest.fn((type, ev, options) =>
        document.body.removeEventListener(type, ev, options),
      ),
    }));
    const bodyMock = new BodyMock();
    const DocumentMock = jest.fn<Document>(() => ({
      addEventListener: jest.fn((type, listener, options) =>
        document.addEventListener(type, listener, options),
      ),
      body: bodyMock,
      createElement: jest.fn(tagName => document.createElement(tagName)),
      getElementById: jest.fn(id => document.getElementById(id)),
      removeEventListener: jest.fn((type, ev, options) =>
        document.removeEventListener(type, ev, options),
      ),
    }));
    const documentMock = new DocumentMock();
    const WindowMock = jest.fn<Window>(() => ({
      addEventListener: jest.fn((type, listener, options) =>
        window.addEventListener(type, listener, options),
      ),
      document: documentMock,
      postMessage: jest.fn(),
      removeEventListener: jest.fn((type, ev, options) =>
        window.removeEventListener(type, ev, options),
      ),
    }));
    const windowMock = new WindowMock();

    return { windowMock, documentMock, bodyMock };
  }

  it('should render hidden by default', () => {
    const wrapper = mount(<Editor {...options} />);

    expect(wrapper.html()).toMatchSnapshot();

    wrapper.unmount();

    expect(wrapper.html()).toMatchSnapshot();
  });
  it('should do nothing by default when refresh button is clicked', () => {
    const wrapper = mount(<Editor {...options} enabled={true} />);
    const panel: React.ComponentClass<EditorPanel.Props> = EditorPanel;
    const editorPanel: ReactWrapper<
      EditorPanel.Props,
      EditorPanel.State
    > = wrapper.find(EditorPanel);

    editorPanel.props().onRefresh();
  });
  it('should refresh when refresh button is clicked', () => {
    const onRefresh = jest.fn();
    const wrapper = mount(
      <Editor {...options} enabled={true} onRefresh={onRefresh} />,
    );
    const panel: React.ComponentClass<EditorPanel.Props> = EditorPanel;
    const editorPanel: ReactWrapper<
      EditorPanel.Props,
      EditorPanel.State
    > = wrapper.find(EditorPanel);

    editorPanel.props().onRefresh();

    expect(onRefresh).toMatchSnapshot();
  });

  it('should do nothing by default when show ids button is clicked', () => {
    const wrapper = mount(<Editor {...options} enabled={true} />);
    const panel: React.ComponentClass<EditorPanel.Props> = EditorPanel;
    const editorPanel: ReactWrapper<
      EditorPanel.Props,
      EditorPanel.State
    > = wrapper.find(EditorPanel);

    editorPanel.props().onShowIds();
  });
  it('should show ids when show ids button is clicked', () => {
    const onShowIds = jest.fn();
    const wrapper = mount(
      <Editor {...options} enabled={true} onShowIds={onShowIds} />,
    );
    const panel: React.ComponentClass<EditorPanel.Props> = EditorPanel;
    const editorPanel: ReactWrapper<
      EditorPanel.Props,
      EditorPanel.State
    > = wrapper.find(EditorPanel);

    editorPanel.props().onShowIds();

    expect(onShowIds).toMatchSnapshot();

    editorPanel.props().onShowIds();

    expect(onShowIds).toMatchSnapshot();
  });
  it('should do unpin when pin button is clicked', () => {
    const wrapper = mount(<Editor {...options} enabled={true} />);
    const panel: React.ComponentClass<EditorPanel.Props> = EditorPanel;
    const editorPanel: ReactWrapper<
      EditorPanel.Props,
      EditorPanel.State
    > = wrapper.find(EditorPanel);

    const editorComponent: ReactWrapper<{}, Editor.State> = wrapper.find(
      EditorComponent,
    );

    expect(editorComponent.instance().state.pinned).toBe(true);

    editorPanel.props().onTogglePinned();

    expect(editorComponent.instance().state.pinned).toBe(false);
  });
  it('should do nothing by default when new language is selected', () => {
    const wrapper = mount(<Editor {...options} enabled={true} />);
    const panel: React.ComponentClass<EditorPanel.Props> = EditorPanel;
    const editorPanel: ReactWrapper<
      EditorPanel.Props,
      EditorPanel.State
    > = wrapper.find(EditorPanel);

    editorPanel.props().onChangeLanguage('en');
  });

  it('should change language when new language is selected', () => {
    const onChangeLanguage = jest.fn();
    const wrapper = mount(
      <Editor
        {...options}
        enabled={true}
        onChangeLanguage={onChangeLanguage}
      />,
    );
    const panel: React.ComponentClass<EditorPanel.Props> = EditorPanel;
    const editorPanel: ReactWrapper<
      EditorPanel.Props,
      EditorPanel.State
    > = wrapper.find(EditorPanel);

    editorPanel.props().onChangeLanguage('en');

    expect(onChangeLanguage).toMatchSnapshot();
  });

  beforeEach(() => {
    document.body.appendChild(app);
    document.body.appendChild(app1);
    document.body.appendChild(app2);
  });

  afterEach(() => {
    document.body.removeChild(app);
    document.body.removeChild(app1);
    document.body.removeChild(app2);
  });

  it('should search for resource when clicked formatted message text', async () => {
    const { documentMock, windowMock } = createMocks();
    const wrapper = mount(
      <div>
        <IntlBackendProvider locale="en" includeMetadata={true}>
          <IntlNamespaceProvider namespace="namespace">
            <FormattedMessage
              id="message"
              defaultMessage="default message"
              description="description"
            />
          </IntlNamespaceProvider>
        </IntlBackendProvider>
        <Editor
          {...options}
          editorId="editor1"
          enabled={true}
          window={windowMock}
          document={documentMock}
        />
      </div>,
      { attachTo: app1 },
    );

    const spanWithResourceText = wrapper
      .find(FormattedMessage)
      .find('span>span');

    const editorWindowWrapper: ReactWrapper<EditorWindow.Props> = wrapper.find(
      EditorWindow,
    );
    editorWindowWrapper.props().onOpen(Promise.resolve(windowMock.postMessage));

    const element = spanWithResourceText.getDOMNode();

    if (DOMHelpers.Editor.isHtmlElement(element)) {
      element.click();
    }

    const panel = wrapper.find(EditorPanel).getDOMNode();

    if (DOMHelpers.Editor.isHtmlElement(panel)) {
      panel.click();
    }
    await delay(100);
    wrapper.unmount();
    expect(windowMock).toMatchSnapshot();
  });

  it('should do not search for resource after search is disabled', async () => {
    const { documentMock, windowMock } = createMocks();
    const wrapper = mount(
      <div>
        <IntlBackendProvider locale="en" includeMetadata={true}>
          <IntlNamespaceProvider namespace="namespace">
            <FormattedMessage
              id="message"
              defaultMessage="default message"
              description="description"
            />
          </IntlNamespaceProvider>
        </IntlBackendProvider>
        <Editor
          {...options}
          enabled={true}
          editorId="editor2"
          window={windowMock}
          document={documentMock}
        />
      </div>,
      { attachTo: app2 },
    );
    const panel: React.ComponentClass<EditorPanel.Props> = EditorPanel;
    const editorPanel: ReactWrapper<
      EditorPanel.Props,
      EditorPanel.State
    > = wrapper.find(EditorPanel);

    editorPanel.props().onToggleSearch();

    const spanWithResourceText = wrapper
      .find(FormattedMessage)
      .find('span>span');

    const element = spanWithResourceText.getDOMNode();

    if (DOMHelpers.Editor.isHtmlElement(element)) {
      element.click();
    }

    await delay(100);
    wrapper.unmount();
    expect(windowMock).toMatchSnapshot();
  });

  it('should switch search enabled on key pressed', async () => {
    const { documentMock, windowMock } = createMocks();
    const wrapper = mount(
      <Editor
        {...options}
        enabled={true}
        window={windowMock}
        document={documentMock}
      />,
    );
    const editorComponent: ReactWrapper<
      Editor.RequiredProps,
      Editor.State
    > = wrapper.find(EditorComponent);

    expect(editorComponent.instance().state.searchEnabled).toBe(true);

    const keypressOptions = {
      ctrlKey: true,
      key: 'Enter',
    };
    const keypress = new KeyboardEvent('keypress', keypressOptions);

    document.dispatchEvent(keypress);
    await delay();
    expect(editorComponent.instance().state.searchEnabled).toBe(false);
  });

  it('should switch search enabled on message post', async () => {
    const { documentMock, windowMock } = createMocks();
    const wrapper = mount(
      <Editor
        {...options}
        enabled={true}
        window={windowMock}
        document={documentMock}
      />,
    );
    const editorComponent: ReactWrapper<
      Editor.RequiredProps,
      Editor.State
    > = wrapper.find(EditorComponent);

    expect(editorComponent.instance().state.searchEnabled).toBe(true);

    const keypressOptions = {
      ctrlKey: true,
      key: 'Enter',
    };
    const message = new MessageEvent('message', { data: keypressOptions });

    window.dispatchEvent(message);
    await delay();
    expect(editorComponent.instance().state.searchEnabled).toBe(false);

    wrapper.unmount();
  });
});
