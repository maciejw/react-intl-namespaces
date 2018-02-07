@echo off
setlocal
call yarn build && ^
call tsc -p tsconfig.react-intl-namespaces.json && ^
call tsc -p tsconfig.react-intl-namespaces-locize-client.json && ^
call tsc -p tsconfig.react-intl-namespaces-locize-editor.json && ^
del /s lib\*types.js && ^
copy /y packages\react-intl-namespaces\package.json  lib\react-intl-namespaces\package.json && ^
copy /y packages\react-intl-namespaces-locize-client\package.json  lib\react-intl-namespaces-locize-client\package.json && ^
copy /y packages\react-intl-namespaces-locize-editor\package.json  lib\react-intl-namespaces-locize-editor\package.json && ^
echo success
endlocal