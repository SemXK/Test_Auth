import { FC } from 'react';
import styled from '@emotion/styled';
import { useForm } from 'react-hook-form';

const CreateDashboardStyled = styled.div``;

interface CreateDashboardProps {
  onCreate: (title: string) => void;
}

interface CreateDashboardFormData {
  title: string;
}

export const CreateDashboard: FC<CreateDashboardProps> = ({ onCreate }) => {
  const { register, handleSubmit, control } = useForm<CreateDashboardFormData>();
  const onSubmit = (data: CreateDashboardFormData) => {
    onCreate(data.title);
    control.setValue('title', '');
  };

  return (
    <CreateDashboardStyled>
      <h2>Crea Dashboard</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input name="title" ref={register({ required: true, maxLength: 20 })} />
        <button type="submit"> Crea </button>
      </form>
    </CreateDashboardStyled>
  );
};
