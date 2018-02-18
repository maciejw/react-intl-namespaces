import { mount } from 'enzyme';
import * as React from 'react';
import {
  defineMessages,
  FormattedMessage,
  IntlNamespaceProvider,
} from 'react-intl-namespaces';

import { IntlBackendContext } from '../context';
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
  const sut = (
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
  );
  const IntlBackendMock = jest.fn<IntlBackendContext.IntlBackend>(() => ({
    addMissingMessage: jest.fn(),
    getIntlProps: jest.fn(() => ({
      locale: 'en',
    })),
    getMessagesFromNamespace: jest.fn(async notification => {
      await delay();
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
    }),
  }));

  it('should provide translated messages and show translations', async () => {
    const intlBackendMock = new IntlBackendMock({});

    const wrapper = mount(sut, {
      context: {
        intlBackend: intlBackendMock,
      },
    });

    await delay();

    expect(wrapper.html()).toMatchSnapshot();
    expect(intlBackendMock).toMatchSnapshot();
  });

  it('should provide translations and but show message keys', async () => {
    const intlBackendMock = new IntlBackendMock();

    const wrapper = mount(sut, {
      context: {
        intlBackend: intlBackendMock,
      },
    });

    await delay();

    expect(wrapper.html()).toMatchSnapshot();
    expect(intlBackendMock).toMatchSnapshot();
  });
});
