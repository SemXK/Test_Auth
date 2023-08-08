import styled from '@emotion/styled';
import { useAuth } from '../context/auth';

const StyledNav = styled.nav`
  background-color: black;
  color: white;
  height: 60px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  .spacer {
    flex-grow: 1;
  }
  button {
    border: 1px solid rgba(0, 0, 0, 0);
    cursor: pointer;
    &:hover {
      border: 1px solid white;
    }
    background: none;
    color: white;
    padding: 10px;
    font-size: 12pt;
    font-weight: bold;
  }
`;

export const Nav = () => {
  const { logout } = useAuth();

  return (
    <StyledNav>
      <p>Lacerba d&d</p>
      <button onClick={logout}>logout</button>
    </StyledNav>
  );
};
