import * as React from 'react';
import * as ReactDom from 'react-dom';
import { addLocaleData, FormattedRelative } from 'react-intl';
import * as pl from 'react-intl/locale-data/pl';
import { Component1 } from './Component1';

import {
  FormattedMessage,
  InltNamespaces,
  IntlBackendProvider,
  IntlNamespaceProvider,
} from 'react-intl-namespaces';
import { Editor } from 'react-intl-namespaces-locize-editor';

import { ResourceProvider } from 'react-intl-namespaces';
import { LocizeClient } from 'react-intl-namespaces-locize-client';

addLocaleData(pl[0]);

const options: Editor.Required = {
  apiKey: '2d70c966-362a-4607-ad92-2818adb044b6',
  language: 'en',
  projectId: '06192059-3c48-4603-88ca-c0096e694e8b',
  referenceLanguage: 'en',
};
const resourceServer = new LocizeClient(window, options);

const resourceProvider = new ResourceProvider(resourceServer);

const getMessagesFromNamespaceFactory: IntlBackendProvider.GetMessagesFromNamespaceFactory = getIntlProps => (
  namespaceLoadedNotification,
  namespace,
  includeNamespaces = [],
) => {
  console.log('Loading', namespace, 'including', includeNamespaces);

  resourceProvider.requestNamespace(
    namespaceLoadedNotification,
    ...[namespace, ...includeNamespaces],
  );
};

const addMissingMessageFactory: IntlBackendProvider.AddMissingMessageFactoryFactory = getIntlProps => message => {
  console.log('registering missing or modified message', message);

  resourceProvider.requestMessage(message);
};
class App extends React.Component<App.Props, App.State> {
  constructor(props: App.Props, context: {}) {
    super(props, context);

    this.state = { language: 'en', showIds: false };
  }

  public render() {
    return (
      <div>
        <div>
          <label>
            change language
            <select
              value={this.state.language}
              onChange={e =>
                this.setState({
                  language: e.target.value,
                  showIds: this.state.showIds,
                })
              }
            >
              {this.props.languages.map(l => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          <label>
            show keys
            <input
              type="checkbox"
              checked={this.state.showIds}
              onChange={e =>
                this.setState({
                  language: this.state.language,
                  showIds: e.target.checked,
                })
              }
            />
          </label>
        </div>
        <IntlBackendProvider
          locale={this.state.language}
          defaultLocale={this.state.language}
          key={this.state.language + ' ' + this.state.showIds}
          includeMetadata={true}
          showIds={this.state.showIds}
          getMessagesFromNamespaceFactory={getMessagesFromNamespaceFactory}
          addMissingMessageFactory={addMissingMessageFactory}
        >
          <div>
            {this.props.children}
            <Editor {...options} />
          </div>
        </IntlBackendProvider>
      </div>
    );
  }
}
namespace App {
  export interface Props {
    languages: string[];
  }
  export interface State {
    language: string;
    showIds: boolean;
  }
}

ReactDom.render(
  <App languages={['en', 'pl']}>
    <IntlNamespaceProvider namespace="App">
      <div style={{ margin: '20px' }}>
        <Component1 />
        <FormattedMessage id="main-section" defaultMessage="App main section" />
        <div>
          <button>
            <FormattedMessage
              id="button-ok"
              defaultMessage="Confirm"
              description="Confirmation button"
            />
          </button>
        </div>
      </div>
    </IntlNamespaceProvider>
    <IntlNamespaceProvider namespace="Module1">
      <div>
        <FormattedMessage
          id="main-section"
          defaultMessage="Module1 main section"
        />
        <div>
          <FormattedMessage
            id="card-count"
            defaultMessage="Card count: {count, number}"
            values={{ count: 6 }}
          />
        </div>
        <div>
          <FormattedMessage
            id="interest-rate"
            defaultMessage="Interest rate: {interestRate, number, percent}"
            values={{ interestRate: 0.12 }}
          />
        </div>
      </div>
    </IntlNamespaceProvider>
    <IntlNamespaceProvider namespace="Module2" includeNamespace={['App']}>
      <div>
        <div>
          <FormattedMessage
            id="last-visited-short"
            defaultMessage="Page was visited {date, time, short}"
            values={{ date: new Date().setHours(-26) }}
          />
        </div>
        <div>
          <FormattedMessage
            id="last-visited-date-medium"
            defaultMessage="Page was visited {date, date, medium}"
            values={{ date: new Date().setHours(-26) }}
          />
        </div>
        <div>
          <FormattedMessage
            id="last-visited-time-medium"
            defaultMessage="Page was visited {date, time, medium}"
            values={{ date: new Date().setHours(-26) }}
          />
        </div>
        <div>
          <FormattedMessage
            id="last-visited-long"
            defaultMessage="Page was visited {date, time, long}"
            values={{ date: new Date().setHours(-26) }}
          />
        </div>
        <div>
          <FormattedMessage
            id="last-visited-relative"
            defaultMessage="Page was visited {date}"
            values={{
              date: (
                <FormattedRelative
                  units="hour"
                  value={new Date().setHours(-26)}
                />
              ),
            }}
          />
        </div>
        <div>
          <FormattedMessage
            id="response-gender"
            defaultMessage={`{gender, select,
              male {He}
              female {She}
              other {They}
          } will respond shortly.`}
            values={{ gender: 'female' }}
          />
        </div>
        <div>
          <FormattedMessage
            id="response-gender"
            defaultMessage={`{gender, select,
              male {He}
              female {She}
              other {They}
          } will respond shortly.`}
            values={{ gender: 'male' }}
          />
        </div>
        <div>
          <FormattedMessage
            id="tax-info"
            defaultMessage={`{taxableArea, select,
              yes {An additional {taxRate, number, percent} tax will be collected.}
              other {No taxes apply.}
          }`}
            values={{ taxableArea: 'yes', taxRate: 0.03 }}
          />
        </div>
        <div>
          <FormattedMessage
            id="tax-info"
            defaultMessage={`{taxableArea, select,
              yes {An additional {taxRate, number, percent} tax will be collected.}
              other {No taxes apply.}
          }`}
            values={{ taxableArea: 'no' }}
          />
        </div>
        <div>
          <FormattedMessage
            id="basket-pluralization"
            defaultMessage={`You have {itemCount, plural,
              =0 {no items}
              one {1 item}
              other {{itemCount} items}
          }.`}
            values={{ itemCount: 0 }}
          />
        </div>
        <div>
          <FormattedMessage
            id="basket-pluralization"
            defaultMessage={`You have {itemCount, plural,
              =0 {no items}
              one {1 item}
              other {{itemCount} items}
          }.`}
            values={{ itemCount: 1 }}
          />
        </div>
        <div>
          <FormattedMessage
            id="basket-pluralization"
            defaultMessage={`You have {itemCount, plural,
              =0 {no items}
              one {1 item}
              other {{itemCount} items}
          }.`}
            values={{ itemCount: 2 }}
          />
        </div>
        <div>
          <FormattedMessage
            id="basket-pluralization"
            defaultMessage={`You have {itemCount, plural,
              =0 {no items}
              one {1 item}
              other {{itemCount} items}
          }.`}
            values={{ itemCount: 3 }}
          />
        </div>
        <div>
          <FormattedMessage
            id="basket-pluralization"
            defaultMessage={`You have {itemCount, plural,
              =0 {no items}
              one {1 item}
              other {{itemCount} items}
          }.`}
            values={{ itemCount: 4 }}
          />
        </div>
        <div>
          <FormattedMessage
            id="basket-pluralization"
            defaultMessage={`You have {itemCount, plural,
              =0 {no items}
              one {1 item}
              other {{itemCount} items}
          }.`}
            values={{ itemCount: 8 }}
          />
        </div>
        <div>
          <FormattedMessage
            id="basket-pluralization"
            defaultMessage={`You have {itemCount, plural,
              =0 {no items}
              one {1 item}
              other {{itemCount} items}
          }.`}
            values={{ itemCount: 22 }}
          />
        </div>
        <div>
          <FormattedMessage
            id="messages-count"
            defaultMessage={`
            Hello {gender, select,
              male {Mr.}
              female {Mrs.}
              other {}
              } {name} you have unread {count, plural,
                =0{no messages}
                one {# message}
                other {# messages}
                }`}
            values={{ count: 0, name: 'John', gender: 'male' }}
          />
        </div>

        <div>
          <FormattedMessage
            id="messages-count"
            defaultMessage={`
            Hello {gender, select,
              male {Mr.}
              female {Mrs.}
              other {}
              } {name} you have {count, plural,
                =0{no unread messages}
                one {# unread message}
                other {# unread messages}
                }`}
            values={{ count: 8, name: 'Jane', gender: 'female' }}
          />
        </div>
        <div>
          <button>
            <FormattedMessage id="App:button-ok" defaultMessage="Confirm" />
          </button>
        </div>
      </div>
    </IntlNamespaceProvider>
  </App>,
  document.getElementById('app'),
);
