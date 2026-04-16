import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import * as UserContextModule from './src/context/UserContext';

const UserProvider =
  UserContextModule.UserProvider || UserContextModule.default;

export default function App() {
  if (!UserProvider) {
    return <AppNavigator />;
  }

  return (
    <UserProvider>
      <AppNavigator />
    </UserProvider>
  );
}