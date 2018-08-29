import * as React from 'react';
import * as ReactDom from 'react-dom';
import { addLocaleData, FormattedRelative } from 'react-intl';
import * as pl from 'react-intl/locale-data/pl';
import { Component1 } from './Component1';

import {
  defineMessages,
  FormattedMessage,
  IntlBackendProvider,
  IntlNamespaceProvider,
  IntlNamespaces,
  LogLevel,
  setLogLevel,
} from 'react-intl-namespaces';
import { Editor } from 'react-intl-namespaces-locize-editor';

import { ResourceProvider } from 'react-intl-namespaces';
import { LocizeClient } from 'react-intl-namespaces-locize-client';

addLocaleData(pl[0]);
setLogLevel(LogLevel.debug);

const options: Editor.RequiredProps = {
  apiKey: '5ce337f5-e9fe-47ac-84b5-aab055550176',
  language: 'en',
  projectId: 'cf901448-51a6-4fd7-acff-9903a2eef44d',
  referenceLanguage: 'en',
};
const resourceServer = new LocizeClient(window, options);

const languagesPromise = resourceServer.getLanguages();

const resourceProvider = new ResourceProvider(resourceServer);

const getMessagesFromNamespaceFactory: IntlBackendProvider.GetMessagesFromNamespaceFactory = getIntlProps => (
  namespaceLoadedNotification,
  namespace,
  includeNamespaces = [],
) => {
  resourceProvider.requestNamespace(
    namespaceLoadedNotification,
    ...[namespace, ...includeNamespaces],
  );
};

const addMissingMessageFactory: IntlBackendProvider.AddMissingMessageFactory = getIntlProps => message => {
  resourceProvider.requestMessage(message);
};
class App extends React.Component<App.Props, App.State> {
  constructor(props: App.Props, context: {}) {
    super(props, context);

    this.state = { language: 'en', showIds: false, languages: [] };
  }

  public async componentDidMount() {
    const languages = await languagesPromise;
    this.setState({ languages });
  }

  public render() {
    return (
      <div>
        <IntlBackendProvider
          locale={this.state.language}
          defaultLocale={options.referenceLanguage}
          key={`${this.state.language},${this.state.showIds}`}
          includeMetadata={true}
          showIds={this.state.showIds}
          getMessagesFromNamespaceFactory={getMessagesFromNamespaceFactory}
          addMissingMessageFactory={addMissingMessageFactory}
        >
          <div>{this.props.children}</div>
        </IntlBackendProvider>
        <Editor
          mode="iframe"
          {...options}
          onShowIds={show => {
            this.setState({ ...this.state, showIds: show });
          }}
          language={this.state.language}
          languages={this.state.languages}
          onChangeLanguage={language => {
            this.setState({ language });
            resourceProvider.changeLanguage(language);
          }}
          onRefresh={() => {
            resourceProvider.refresh(this.state.language);
          }}
        />
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
    languages: string[];
    showIds: boolean;
  }
}

const AppNamespace = defineMessages({
  'button-ok': {
    defaultMessage: 'Confirm',
    description: 'Confirmation button',
    id: 'button-ok',
  },
  'main-section': {
    defaultMessage: 'App main section',
    id: 'main-section',
  },
});

// const Module1Namespace = defineMessages({
//   'card-count': {
//     defaultMessage: 'Card count: {count, number}',
//     id: 'card-count',
//   },
//   'interest-rate': {
//     defaultMessage: 'Interest rate: {interestRate, number, percent}',
//     id: 'interest-rate',
//   },
//   'main-section': {
//     defaultMessage: 'Module1 main section',
//     id: 'main-section',
//   },
// });

// const Module2Namespace = defineMessages({
//   'basket-pluralization': {
//     defaultMessage: `You have {itemCount, plural,
//       =0 {no items}
//       one {1 item}
//       other {{itemCount} items}
//   }.`,
//     id: 'basket-pluralization',
//   },
//   'last-visited-date-medium': {
//     defaultMessage: 'Page was visited {date, date, medium}',
//     id: 'last-visited-date-medium',
//   },
//   'last-visited-long': {
//     defaultMessage: 'Page was visited {date, time, long}',
//     id: 'last-visited-long',
//   },
//   'last-visited-relative': {
//     defaultMessage: 'Page was visited {date}',
//     id: 'last-visited-relative',
//   },
//   'last-visited-short': {
//     defaultMessage: 'Page was visited {date, time, short}',
//     id: 'last-visited-short',
//   },

//   'last-visited-time-medium': {
//     defaultMessage: 'Page was visited {date, time, medium}',
//     id: 'last-visited-time-medium',
//   },

//   'messages-count': {
//     defaultMessage: `
//     Hello {gender, select,
//       male {Mr.}
//       female {Mrs.}
//       other {}
//       } {name} you have unread {count, plural,
//         =0{no messages}
//         one {# message}
//         other {# messages}
//         }`,
//     id: 'messages-count',
//   },
//   'response-gender': {
//     defaultMessage: `{gender, select,
//       male {He}
//       female {She}
//       other {They}
//   } will respond shortly.`,
//     id: 'response-gender',
//   },
//   'tax-info': {
//     defaultMessage: `{taxableArea, select,
//       yes {An additional {taxRate, number, percent} tax will be collected.}
//       other {No taxes apply.}
//   }`,
//     id: 'tax-info',
//   },
// });

ReactDom.render(
  <App languages={['en', 'pl']}>
    <IntlNamespaceProvider namespace="App" messages={AppNamespace}>
      <div>
        <div style={{ margin: '20px', pointerEvents: 'none' }}>
          <Component1 />
          <FormattedMessage {...AppNamespace['main-section']} />
          <div>
            <button>
              <FormattedMessage {...AppNamespace['button-ok']} />
            </button>
          </div>
        </div>

        {/* <IntlNamespaceProvider namespace="Module1">
          <div>
            <FormattedMessage {...Module1Namespace['main-section']} />
            <div>
              <FormattedMessage
                {...Module1Namespace['card-count']}
                values={{ count: 6 }}
              />
            </div>
            <div>
              <FormattedMessage
                {...Module1Namespace['interest-rate']}
                values={{ interestRate: 0.12 }}
              />
            </div>
          </div>
        </IntlNamespaceProvider> */}
        {/* <IntlNamespaceProvider namespace="Module2" includeNamespace={['App']}>
          <div>
            <div>
              <FormattedMessage
                {...Module2Namespace['last-visited-short']}
                values={{ date: new Date().setHours(-26) }}
              />
            </div>
            <div>
              <FormattedMessage
                {...Module2Namespace['last-visited-date-medium']}
                values={{ date: new Date().setHours(-26) }}
              />
            </div>
            <div>
              <FormattedMessage
                {...Module2Namespace['last-visited-time-medium']}
                values={{ date: new Date().setHours(-26) }}
              />
            </div>
            <div>
              <FormattedMessage
                {...Module2Namespace['last-visited-long']}
                values={{ date: new Date().setHours(-26) }}
              />
            </div>
            <div>
              <FormattedMessage
                {...Module2Namespace['last-visited-relative']}
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
                {...Module2Namespace['response-gender']}
                values={{ gender: 'female' }}
              />
            </div>
            <div>
              <FormattedMessage
                {...Module2Namespace['response-gender']}
                values={{ gender: 'male' }}
              />
            </div>
            <div>
              <FormattedMessage
                {...Module2Namespace['tax-info']}
                values={{ taxableArea: 'yes', taxRate: 0.03 }}
              />
            </div>
            <div>
              <FormattedMessage
                {...Module2Namespace['tax-info']}
                values={{ taxableArea: 'no' }}
              />
            </div>
            <div>
              <FormattedMessage
                {...Module2Namespace['basket-pluralization']}
                values={{ itemCount: 0 }}
              />
            </div>
            <div>
              <FormattedMessage
                {...Module2Namespace['basket-pluralization']}
                values={{ itemCount: 1 }}
              />
            </div>
            <div>
              <FormattedMessage
                {...Module2Namespace['basket-pluralization']}
                values={{ itemCount: 2 }}
              />
            </div>
            <div>
              <FormattedMessage
                {...Module2Namespace['basket-pluralization']}
                values={{ itemCount: 3 }}
              />
            </div>
            <div>
              <FormattedMessage
                {...Module2Namespace['basket-pluralization']}
                values={{ itemCount: 4 }}
              />
            </div>
            <div>
              <FormattedMessage
                {...Module2Namespace['basket-pluralization']}
                values={{ itemCount: 8 }}
              />
            </div>
            <div>
              <FormattedMessage
                {...Module2Namespace['basket-pluralization']}
                values={{ itemCount: 22 }}
              />
            </div>
            <div>
              <FormattedMessage
                {...Module2Namespace['messages-count']}
                values={{ count: 0, name: 'John', gender: 'male' }}
              />
            </div>

            <div>
              <FormattedMessage
                {...Module2Namespace['messages-count']}
                values={{ count: 8, name: 'Jane', gender: 'female' }}
              />
            </div>
            <div>
              <button>
                <FormattedMessage id="App:button-ok" defaultMessage="Confirm" />
              </button>
            </div>
          </div>
        </IntlNamespaceProvider> */}
      </div>
    </IntlNamespaceProvider>
  </App>,
  document.getElementById('app'),
);
