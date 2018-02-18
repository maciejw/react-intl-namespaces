import { mount } from 'enzyme';
import * as React from 'react';
import {
  defineMessages,
  FormattedMessage,
  IntlBackendProvider,
  IntlNamespaceProvider,
} from 'react-intl-namespaces';
import { delay } from '../delay';

const messages = defineMessages<'property1'>({
  property1: {
    defaultMessage: 'text1 {someValue}',
    description: 'description1',
    id: 'property1',
  },
});

const values = { someValue: 'value1' };

describe('IntlNamespaceProvider', () => {
  const sut = (props: IntlBackendProvider.Props = {}) => (
    <IntlBackendProvider locale="en" {...props}>
      <IntlNamespaceProvider
        namespace="namespace"
        includeNamespace={['anotherNamespace']}
      >
        <div>
          <FormattedMessage
            id="anotherNamespace:property1"
            defaultMessage="test2 {someValue}"
            values={values}
          />
          <FormattedMessage {...messages.property1} values={values} />
        </div>
      </IntlNamespaceProvider>
    </IntlBackendProvider>
  );

  const addMissingMessage = jest.fn();

  const getMessagesFromNamespace = jest.fn(async notification => {
    // await delay();
    notification({
      namespace: 'anotherNamespace',
      resource: {
        property1: 'translated text2 {someValue}',
      },
    });
    notification({
      namespace: 'namespace',
      resource: {
        property1: 'translated text1 {someValue}',
      },
    });
  });

  const ResourceProviderMock = jest.fn<IntlBackendProvider.ResourceProvider>(
    () => ({
      addMissingMessageFactory: jest.fn().mockReturnValue(addMissingMessage),
      getMessagesFromNamespaceFactory: jest
        .fn()
        .mockReturnValue(getMessagesFromNamespace),
    }),
  );

  it('should render with default messages', () => {
    const wrapper = mount(sut());

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should render with messages ids', () => {
    const wrapper = mount(sut({ showIds: true }));

    expect(wrapper.html()).toMatchSnapshot();
  });
  it('should render with messages with metadata', () => {
    const wrapper = mount(sut({ includeMetadata: true }));

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should provide messages from backend and show them', async () => {
    const mock = new ResourceProviderMock();
    const wrapper = mount(sut({ locale: 'en', ...mock }));

    await delay();

    expect(wrapper.html()).toMatchSnapshot();
    expect(mock).toMatchSnapshot();
    expect(getMessagesFromNamespace).toMatchSnapshot();
    expect(addMissingMessage).toMatchSnapshot();
  });
});
