import { createElement } from 'react';
import { render } from 'react-dom';

import Modal from 'react-modal';

import { Provider } from 'react-redux';
import store from './store';

import { Builder } from './components/Builder';

import './styles/style.scss';


const wrapper = document.getElementById('react-container')!;
Modal.setAppElement(wrapper);

render(
  <Provider store={store}>
    <Builder />
  </Provider>,
  wrapper
)
