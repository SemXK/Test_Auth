import styled from '@emotion/styled';
import { FC } from 'react';
import { useForm } from 'react-hook-form';

export const CreateContent: FC<{ create: (text: string) => void }> = ({ create }) => {
  const { handleSubmit, register, control } = useForm<{ name: string }>();
  const onSubmit = (data: { name: string }) => {
    create(data.name);
    control.setValue('name', '');
  };
  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <input name="name" placeholder="crea contenuto" defaultValue="" ref={register({ required: true })} />
      <input type="submit" />
    </StyledForm>
  );
};

const StyledForm = styled.form`
  padding: 10px;
`;
