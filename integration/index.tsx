import * as React from 'react';
import * as ReactDom from 'react-dom';
import { addLocaleData, FormattedRelative } from 'react-intl';
import * as pl from 'react-intl/locale-data/pl';

import {
  FormatMessage,
  InltNamespaces,
  IntlBackendProvider,
  IntlNamespaceProvider,
  TranslatedMessages,
} from '@warpro/react-intl-namespaces';
import { Editor } from '@warpro/react-locize-editor';

import { LocizeClient, ResourceProvider } from '@warpro/react-intl-namespaces';

addLocaleData(pl[0]);

const options = {
  apiKey: '6b9ac145-b395-47dc-bcc4-001398c4c843',
  lng: 'en',
  projectId: '2592abb8-1129-457d-a06b-836745d33c55',
};
const resourceServer = new LocizeClient(window, options);

const resourceProvider = new ResourceProvider(resourceServer);

const getMessagesFromNamespaceFactory: IntlBackendProvider.GetMessagesFromNamespaceFactory = getIntlProps => (
  namespace,
  includeNamespaces = [],
) => {
  console.log('Loading', namespace, 'including', includeNamespaces);

  [namespace, ...includeNamespaces].forEach(n => {
    resourceProvider.requestNamespace(n);
  });
};

const registerNamespaceDownloadNotification: IntlBackendProvider.RegisterNamespaceDownloadNotification = callback => {
  resourceProvider.getNamespaceDownloadNotification(
    ({ namespace, resource: messages }) => {
      console.log('download namespace', namespace, 'with messages', messages);

      callback({ namespace, messages });
    },
  );
};
const addMissingMessageFactory: IntlBackendProvider.AddMissingMessageFactoryFactory = getIntlProps => message => {
  console.log('registering missing or modified message', message);

  resourceProvider.registerMissingOrModified(message);
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
          registerNamespaceDownloadNotification={
            registerNamespaceDownloadNotification
          }
        >
          <div>
            {this.props.children}
            <Editor />
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
        <FormatMessage id="main-section" defaultMessage="App main section" />
        <div>
          <button>
            <FormatMessage
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
        <FormatMessage
          id="main-section"
          defaultMessage="Module1 main section"
        />
        <div>
          <FormatMessage
            id="card-count"
            defaultMessage="Card count: {count, number}"
            values={{ count: 6 }}
          />
        </div>
        <div>
          <FormatMessage
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
          <FormatMessage
            id="last-visited-short"
            defaultMessage="Page was visited {date, time, short}"
            values={{ date: new Date().setHours(-26) }}
          />
        </div>
        <div>
          <FormatMessage
            id="last-visited-date-medium"
            defaultMessage="Page was visited {date, date, medium}"
            values={{ date: new Date().setHours(-26) }}
          />
        </div>
        <div>
          <FormatMessage
            id="last-visited-time-medium"
            defaultMessage="Page was visited {date, time, medium}"
            values={{ date: new Date().setHours(-26) }}
          />
        </div>
        <div>
          <FormatMessage
            id="last-visited-long"
            defaultMessage="Page was visited {date, time, long}"
            values={{ date: new Date().setHours(-26) }}
          />
        </div>
        <div>
          <FormatMessage
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
          <FormatMessage
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
          <FormatMessage
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
          <FormatMessage
            id="tax-info"
            defaultMessage={`{taxableArea, select,
              yes {An additional {taxRate, number, percent} tax will be collected.}
              other {No taxes apply.}
          }`}
            values={{ taxableArea: 'yes', taxRate: 0.03 }}
          />
        </div>
        <div>
          <FormatMessage
            id="tax-info"
            defaultMessage={`{taxableArea, select,
              yes {An additional {taxRate, number, percent} tax will be collected.}
              other {No taxes apply.}
          }`}
            values={{ taxableArea: 'no' }}
          />
        </div>
        <div>
          <FormatMessage
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
          <FormatMessage
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
          <FormatMessage
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
          <FormatMessage
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
          <FormatMessage
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
          <FormatMessage
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
          <FormatMessage
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
          <FormatMessage
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
          <FormatMessage
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
            <FormatMessage id="App:button-ok" defaultMessage="Confirm" />
          </button>
        </div>
      </div>
    </IntlNamespaceProvider>
  </App>,
  document.getElementById('app'),
);
