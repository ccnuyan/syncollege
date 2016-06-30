import React, {PropTypes} from 'react';
import cn from 'classnames';
import MainRoutes from './MainRoutes.jsx';
import StoreProvider from '../StoreProvider';

class Main extends React.Component {
  render() {
    return (
      <StoreProvider>
        <MainRoutes></MainRoutes>
      </StoreProvider>
    );
  }
}

export default Main;
