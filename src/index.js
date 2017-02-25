import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import App from './App';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { reducer } from './reducer'
injectTapEventPlugin();

const element = document.getElementById('root')

if (element instanceof HTMLElement) { // eslint-disable-line
  const store = createStore(
    reducer,
    composeWithDevTools(
      applyMiddleware(thunk)
    )
  )

  if (process.env.NODE_ENV === 'development') {
    console.info('New App [render]') //eslint-disable-line
  }

  const AppContainer = () => (
    <MuiThemeProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </MuiThemeProvider>
  )

  ReactDOM.render(
    <AppContainer />,
    element
  )

} else {
  throw new Error(`No HTML element found with ID "root"`)
}