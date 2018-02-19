import { mount } from 'enzyme';
import * as React from 'react';
import { Editor } from './Editor';
import { EditorPanel } from './EditorPanel';

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
describe('EditorPanel', () => {
  const PropsMock = jest.fn<EditorPanel.Props>(() => ({
    languages: ['en', 'pl'],
    onChangeLanguage: jest.fn(),
    onRefresh: jest.fn(),
    onShowIds: jest.fn(),
    onTogglePinned: jest.fn(),
    onToggleSearch: jest.fn(),
  }));

  it('should show panel and handle events', async () => {
    const mock = new PropsMock();

    const wrapper = mount(
      <EditorPanel
        pinned={true}
        showIds={true}
        searchEnabled={true}
        language="en"
        {...mock}
      />,
    );
    expect(wrapper.html()).toMatchSnapshot();

    wrapper.find('button').forEach(b => b.simulate('click'));
    wrapper.find('select').forEach(b => b.simulate('change'));

    expect(mock).toMatchSnapshot();
  });
  it('should not show editor', () => {
    const mock = new PropsMock();

    const wrapper = mount(
      <EditorPanel
        pinned={false}
        showIds={true}
        searchEnabled={false}
        language="en"
        {...mock}
      />,
    );
    expect(wrapper.html()).toMatchSnapshot();
  });
});
