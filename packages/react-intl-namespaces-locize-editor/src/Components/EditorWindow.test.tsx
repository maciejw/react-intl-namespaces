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
  it('should show panel in iframe mode', () => {
    const getLanguagesMock = jest.fn();

    const PropsMock = jest.fn<EditorWindow.Props>(() => ({
      onOpen: jest.fn(),
    }));

    const mock = new PropsMock();

    const wrapper = mount(
      <EditorWindow editorWidthInPixels={100} mode="iframe" {...mock} />,
    );
    expect(wrapper.html()).toMatchSnapshot();

    expect(mock).toMatchSnapshot();
  });

  it('should show panel in window mode', async done => {
    const getLanguagesMock = jest.fn();

    const PropsMock = jest.fn<EditorWindow.Props>(() => ({
      onOpen: jest.fn(),
    }));

    const mock = new PropsMock();

    const wrapper = mount(
      <EditorWindow editorWidthInPixels={100} mode="window" {...mock} />,
    );

    await delay(3030);
    expect(wrapper.html()).toMatchSnapshot();

    expect(mock).toMatchSnapshot();
    done();
  });
});
