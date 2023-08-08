import styled from '@emotion/styled';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Redirect, Link } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { authService } from '../services';

interface LoginData {
  email: string;
  password: string;
}

export const LoginPage = () => {
  const [err, setErr] = useState<boolean>(false);
  const { token, login } = useAuth();
  const { handleSubmit, register } = useForm<{ name: string }>();
  const onSubmit = async (data: LoginData) => {
    setErr(false);
    const res = await login(data.email, data.password);
    setErr(!res);
  };
  if (token) {
    return <Redirect to="/" />;
  }
  return (
    <LoginPageStyled>
      <div className="login">
        <h1> Login User</h1>
        <LoginFormStyled onSubmit={handleSubmit(onSubmit)}>
          <input name="email" type="email" placeholder="email" defaultValue="" ref={register({ required: true })} />
          <input
            name="password"
            type="password"
            placeholder="password"
            defaultValue=""
            ref={register({ required: true })}
          />
          {err && <ErrMsg>Invalid login</ErrMsg>}
          <button type="submit"> Login</button>

          <Link to="/register"> Register </Link>
        </LoginFormStyled>
      </div>
    </LoginPageStyled>
  );
};

const ErrMsg = styled.p`
  color: red;
`;

const LoginFormStyled = styled.form`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  gap: 10px;
  input {
    height: 30px;
    padding: 0 10px;
  }
  button {
    background: #4ad2ff;
    height: 30px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
      background: #06baf6;
    }
  }
`;

const LoginPageStyled = styled.div`
  display: grid;
  place-content: center;
  .login {
    border: 1px solid black;
    margin-top: 20px;
    padding: 20px;
    max-width: 90%;
    width: 800px;
  }
`;
