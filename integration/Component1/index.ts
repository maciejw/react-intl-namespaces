import { injectIntl } from 'react-intl';

import { Component1 } from './Component1';

const TranslatedComponent1 = injectIntl<{}>(Component1, { withRef: true });

export { TranslatedComponent1 as Component1 };
