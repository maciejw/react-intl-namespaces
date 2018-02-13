yarn build && \
yarn tsc -p tsconfig.react-intl-namespaces.json && \
yarn tsc -p tsconfig.react-intl-namespaces-locize-client.json && \
yarn tsc -p tsconfig.react-intl-namespaces-locize-editor.json && \
rm -r lib/**/types.js && \
cp -u packages/react-intl-namespaces/package.json lib/react-intl-namespaces/package.json && \
cp -u packages/react-intl-namespaces-locize-client/package.json lib/react-intl-namespaces-locize-client/package.json && \
cp -u packages/react-intl-namespaces-locize-editor/package.json lib/react-intl-namespaces-locize-editor/package.json && \
cp -u README.md lib/react-intl-namespaces && \
cp -u README.md lib/react-intl-namespaces-locize-client && \
cp -u README.md lib/react-intl-namespaces-locize-editor && \
echo success
