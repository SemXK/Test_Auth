import styled from '@emotion/styled';
import { Nav } from './components/nav';
import { Dashboards } from './pages/Dashboard';
import { LoginPage } from './pages/login';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { useAuth } from './context/auth';
import { FC } from 'react';
import { RegisterPage } from './pages/register';

const Container = styled.div`
  padding: 20px;
`;

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <LoginPage />
        </Route>

        <Route path="/register">
          <RegisterPage />
        </Route>
        <PrivateRoute path="/">
          <Nav />
          <Container>
            <Dashboards />
          </Container>
        </PrivateRoute>
      </Switch>
    </Router>
  );
}

export default App;

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
const PrivateRoute: FC<any> = ({ children, ...rest }) => {
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.token ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};
