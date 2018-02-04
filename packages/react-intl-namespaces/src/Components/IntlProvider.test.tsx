import * as React from 'react';

import { mount } from 'enzyme';
import { FormattedMessage } from './FormattedMessage';
import { IntlProvider } from './IntlProvider';

import { defineMessages } from '../defineMessages';

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

describe('IntlProvider', () => {
  const sut = (
    <IntlProvider locale="en">
      <div>
        <FormattedMessage {...messages.property1} values={values} />
        <FormattedMessage {...messages.property2} />
      </div>
    </IntlProvider>
  );

  it('should show display message', () => {
    const missingMessage = jest.fn();

    const wrapper = mount(sut, {
      context: {
        intlNamespace: {
          missingMessage,
        },
      },
    });
    expect(wrapper.text()).toMatchSnapshot();
    expect(missingMessage).toBeCalledWith({
      defaultMessage: 'text1 {someValue}',
      description: 'description1',
      id: 'property1',
    });
  });
  it('should show message key when forced', () => {
    const missingMessage = jest.fn();
    const getNameOfCurrentNamespace = jest.fn().mockReturnValue('namespace');

    const wrapper = mount(sut, {
      context: {
        intlNamespace: {
          getNameOfCurrentNamespace,
          missingMessage,
          showIds: true,
        },
      },
    });
    expect(wrapper.text()).toMatchSnapshot();
    expect(missingMessage).toBeCalledWith({
      defaultMessage: 'text1 {someValue}',
      description: 'description1',
      id: 'property1',
    });
    expect(getNameOfCurrentNamespace).toBeCalledWith();
  });
});
