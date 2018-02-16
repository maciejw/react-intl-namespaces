const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
require('tslib');

Enzyme.configure({ adapter: new Adapter() });
