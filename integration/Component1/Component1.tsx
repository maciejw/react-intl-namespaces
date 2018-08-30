import * as React from 'react';
import { InjectedIntlProps } from 'react-intl';
import { defineMessages, FormattedMessage } from 'react-intl-namespaces';

export const Component1Messages = defineMessages({
  'Component1.Message': {
    defaultMessage: 'Message from component 1',
    id: 'Component1.Message',
  },
  'Component1.Message2': {
    defaultMessage: 'Message 2 from component 1',
    id: 'Component1.Message2',
  },
});

export class Component1 extends React.Component<InjectedIntlProps> {
  public render() {
    return (
      <div>
        {this.props.intl.formatMessage(
          Component1Messages['Component1.Message'],
        )}{' '}
        asdasdadsd
        {/* <FormattedMessage {...Component1Messages['Component1.Message2']} /> */}
      </div>
    );
  }
}
