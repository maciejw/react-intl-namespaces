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
describe('Editor', () => {
  it('should render hidden by default', () => {
    const wrapper = mount(<Editor {...options} />);

    expect(wrapper.html()).toMatchSnapshot();
  });
});
