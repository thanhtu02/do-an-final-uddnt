import StackNavigator from './StackNavigator';
import UserProvider from './store/UserContext';

export default function App() {
  return (
    <>
      <UserProvider>
        <StackNavigator/>
      </UserProvider>
    </>
  )
}