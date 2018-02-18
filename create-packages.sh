yarn build && \
yarn tsc -p tsconfig.react-intl-namespaces.json && \
yarn tsc -p tsconfig.react-intl-namespaces-locize-client.json && \
yarn tsc -p tsconfig.react-intl-namespaces-locize-editor.json && \
rm -r packages/**/dist/types.js && \
cp -u dists/react-intl-namespaces/dist/index.d.ts packages/react-intl-namespaces/dist && \
cp -u dists/react-intl-namespaces-locize-client/dist/index.d.ts packages/react-intl-namespaces-locize-client/dist && \
cp -u dists/react-intl-namespaces-locize-editor/dist/index.d.ts packages/react-intl-namespaces-locize-editor/dist && \
cp -u README.md packages/react-intl-namespaces && \
cp -u README.md packages/react-intl-namespaces-locize-client && \
cp -u README.md packages/react-intl-namespaces-locize-editor && \
echo success
