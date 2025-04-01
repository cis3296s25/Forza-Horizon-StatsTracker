import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from './AuthContext';

const RouteProtection = ({ element, ...rest }) => {
  const { user } = useAuth();

  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (user && user.userName === rest.username) {
          return element;
        }

        return <Redirect to={{ pathname: '/profile', state: { from: location } }} />;
      }}
    />
  );
};

export default RouteProtection;
