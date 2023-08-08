import styled from '@emotion/styled';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Redirect, Link } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { authService } from '../services';

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export const RegisterPage = () => {
  const [err, setErr] = useState<boolean>(false);
  const [registered, setRegistered] = useState<boolean>(false);
  const { token } = useAuth();
  const { handleSubmit, register } = useForm<{ name: string }>();
  const onSubmit = async (data: RegisterData) => {
    setErr(false);
    const res = await authService.register(data.email, data.name, data.password);
    setErr(!res);
    if (res) {
      setRegistered(true);
    }
  };
  if (token) {
    return <Redirect to="/" />;
  }
  if (registered) {
    return <Redirect to="/login" />;
  }

  return (
    <RegisterPageStyled>
      <div className="login">
        <h1> Register User</h1>
        <RegisterFormStyled onSubmit={handleSubmit(onSubmit)}>
          <input name="name" type="name" placeholder="name" defaultValue="" ref={register({ required: true })} />
          <input name="email" type="email" placeholder="email" defaultValue="" ref={register({ required: true })} />
          <input
            name="password"
            type="password"
            placeholder="password"
            defaultValue=""
            ref={register({ required: true })}
          />
          {err && <ErrMsg>Invalid register</ErrMsg>}
          <button type="submit"> Register </button>

          <Link to="/login"> Login </Link>
        </RegisterFormStyled>
      </div>
    </RegisterPageStyled>
  );
};

const ErrMsg = styled.p`
  color: red;
`;

const RegisterFormStyled = styled.form`
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

const RegisterPageStyled = styled.div`
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
