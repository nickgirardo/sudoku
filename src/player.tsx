import { createElement } from 'react';
import { render } from 'react-dom';

import Modal from 'react-modal';

import { Provider } from 'react-redux';
import store from './store';

import { Player } from './components/Player';

import './styles/style.scss';


const wrapper = document.getElementById('react-container')!;
Modal.setAppElement(wrapper);

render(
  <Provider store={store}>
    <Player />
  </Provider>,
  wrapper
)
