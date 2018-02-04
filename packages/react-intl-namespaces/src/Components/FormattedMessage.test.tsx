import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as ReactIntl from 'react-intl';

import { mount } from 'enzyme';

import { IntlNamespaceContext } from '../context';
import { defineMessages } from '../defineMessages';
import { FormattedMessage } from './FormattedMessage';
import { IntlProvider } from './IntlProvider';

const messages = defineMessages<'property1' | 'property2'>({
  property1: {
    defaultMessage: 'text1 {someValue}',
    description: 'description1',
    id: 'property1',
  },
  property2: {
    defaultMessage: 'text2',
    description: 'description2',
    id: 'property2',
  },
});

const values = { someValue: 'value1' };
describe('FormattedMessage', () => {
  const sut = (
    <div>
      <FormattedMessage {...messages.property1} values={values} />
      <FormattedMessage {...messages.property2} />
    </div>
  );

  it('should display message', () => {
    const wrapper = mount(sut, {
      childContextTypes: {
        intl: PropTypes.object,
        intlNamespace: PropTypes.object,
      },
      context: {
        intl: {
          formatDate: jest.fn(),
          formatHTMLMessage: jest.fn(),
          formatNumber: jest.fn(),
          formatPlural: jest.fn(),
          formatRelative: jest.fn(),
          formatTime: jest.fn(),
          formatMessage(message: ReactIntl.FormattedMessage.MessageDescriptor) {
            return message.id;
          },
          now: jest.fn(),
          textComponent: 'span',
        },
        intlNamespace: {
          includeMetadata: true,
          getNameOfCurrentNamespace() {
            return 'namespace';
          },
          missingMessage: jest.fn(),
        },
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
