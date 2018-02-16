yarn build && \
yarn tsc -p tsconfig.react-intl-namespaces.json && \
yarn tsc -p tsconfig.react-intl-namespaces-locize-client.json && \
yarn tsc -p tsconfig.react-intl-namespaces-locize-editor.json && \
rm -r packages/**/dist/types.js && \
cp -u README.md packages/react-intl-namespaces && \
cp -u README.md packages/react-intl-namespaces-locize-client && \
cp -u README.md packages/react-intl-namespaces-locize-editor && \
echo success
