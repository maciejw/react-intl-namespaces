# React Intl Namespaces

Integrations of [react-intl] internationalization library with [locize.com]
online translation service.

[![build-status-icon]](https://travis-ci.org/maciejw/react-intl-namespaces)
[![npm-react-intl-namespaces-version-icon]](https://www.npmjs.com/package/react-intl-namespaces)
[![npm-react-intl-namespaces-locize-client-version-icon]](https://www.npmjs.com/package/react-intl-namespaces-locize-client)
[![npm-react-intl-namespaces-locize-editor-version-icon]](https://www.npmjs.com/package/react-intl-namespaces-locize-editor)

## Goals of this library

* add support of dividing your application resources into namespaces that can be lazy loaded from server
* make resources statically typed
* add support of [locize.com] in-context editor.
* add resource synchronization with [locize.com] or any other backend.

## Getting started

```tsx
const someNamespace = defineMessages<'property1'>({
  property1: {
    defaultMessage: 'text with {someValue}',
    description: 'description of text with some value',
    id: 'property1',
  },
});

const anotherNamespace = defineMessages<'property1'>({
  property1: {
    defaultMessage: 'another text',
    description: 'description of another text',
    id: 'property1',
  },
});

const values = { someValue: 'value' };

const App = (props: IntlBackendProvider.Props) => (
  <IntlBackendProvider
    locale={props.locale}
    showIds={props.showIds}
    getMessagesFromNamespaceFactory={props.getMessagesFromNamespaceFactory}
    addMissingMessageFactory={props.addMissingMessageFactory}
  >
    <IntlNamespaceProvider namespace="someNamespace">
      <div>
        <FormattedMessage {...someNamespace.property1} values={values} />
      </div>
    </IntlNamespaceProvider>
    <IntlNamespaceProvider namespace="anotherNamespace">
      <div>
        <FormattedMessage {...anotherNamespace.property1} />
      </div>
    </IntlNamespaceProvider>
  </IntlBackendProvider>
);
```

This code uses two namespaces and provides a way of communication with backed using getMessagesFromNamespace and addMissingMessage API.

Namespaces have have the same resource keys, that do not interfere with each other.

Those namespaces could be application modules.

Also we can see with one switch resource keys instead of resource texts when we set showIds to true. This is what will be displayed

```txt
[someNamespace:property1 (someValue)]
```

instead of formatted

```txt
text with value
```

## Building

In order to build this library you have to clone it

```sh
git clone https://github.com/maciejw/react-intl-namespaces.git
```

and restore packages with

```sh
yarn
```

to show sample integration project you can

```sh
yarn start
```

you can also test with

```sh
yarn test
```

## Documentation

//TODO

[locize.com]: https://locize.com
[react-intl]: https://github.com/yahoo/react-intl
[build-status-icon]: https://travis-ci.org/maciejw/react-intl-namespaces.svg?branch=master
[npm-react-intl-namespaces-version-icon]: https://img.shields.io/npm/v/react-intl-namespaces.svg?maxAge=259200
[npm-react-intl-namespaces-locize-client-version-icon]: https://img.shields.io/npm/v/react-intl-namespaces-locize-client.svg?maxAge=259200
[npm-react-intl-namespaces-locize-editor-version-icon]: https://img.shields.io/npm/v/react-intl-namespaces-locize-editor.svg?maxAge=259200
