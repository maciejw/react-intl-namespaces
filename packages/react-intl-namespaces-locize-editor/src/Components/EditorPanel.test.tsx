import { mount } from 'enzyme';
import * as React from 'react';
import { Editor } from './Editor';
import { EditorPanel } from './EditorPanel';

const options: Editor.RequiredProps = {
  apiKey: '6b9ac145-b395-47dc-bcc4-001398c4c843',
  language: 'en',
  projectId: '2592abb8-1129-457d-a06b-836745d33c55',
  referenceLanguage: 'en',
};
describe('EditorPanel', () => {
  it('should show panel and handle events', () => {
    const getLanguagesMock = jest.fn();

    const PropsMock = jest.fn<EditorPanel.Props>(() => ({
      getLanguages: jest.fn().mockReturnValue(['en', 'pl']),
      onChangeLanguage: jest.fn(),
      onRefresh: jest.fn(),
      onSearchEnabled: jest.fn(),
      onShowIds: jest.fn(),
    }));

    const mock = new PropsMock();

    const wrapper = mount(
      <EditorPanel
        showIds={true}
        searchEnabled={true}
        language="en"
        {...mock}
      />,
    );
    expect(wrapper.html()).toMatchSnapshot();

    wrapper.find('button').forEach(b => b.simulate('click'));
    wrapper.find('select').forEach(b => b.simulate('change'));

    expect(wrapper.html()).toMatchSnapshot();

    expect(mock).toMatchSnapshot();
  });
});
