import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './thems/css/tabler.min.css';
import './thems/css/tabler-flags.min.css';
import './thems/css/tabler-payments.min.css';
import './thems/css/tabler-vendors.min.css';
import './thems/css/demo.min.css';
import './thems/css/collapse-tree-view.css';

import 'react-toastify/dist/ReactToastify.css';

import './thems/js/tabler.min.js';
import './thems/js/demo.min.js';
import 'react-datepicker/dist/react-datepicker.css';

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
