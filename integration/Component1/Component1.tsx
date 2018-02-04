import * as React from 'react';
import { InjectedIntlProps } from 'react-intl';
import { FormattedMessage } from 'react-intl-namespaces';

export class Component1 extends React.Component<InjectedIntlProps> {
  public render() {
    return (
      <div>
        {this.props.intl.formatMessage({
          defaultMessage: 'Message from Component1',
          id: 'Component1.Message',
        })}

        <FormattedMessage
          id="Component1.Message2"
          defaultMessage="Message2 from Component1"
        />
      </div>
    );
  }
}
