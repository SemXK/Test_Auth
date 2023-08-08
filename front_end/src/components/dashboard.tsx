import styled from '@emotion/styled';
import { FC } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Content } from './content';
import { CreateContent } from './create-content';

const DashboardStyled = styled.div`
  width: 220px;
  height: 100%;
  min-height: 400px;
  border: 1px solid #ccc;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  overflow-y: scroll;
  flex-grow: 1;
  h2 {
    margin: 0;
    padding: 10px 0;
    border-bottom: 1px solid #ccc;
    font-size: 15px;
    text-align: center;
  }
`;

const ContentList = styled.div<{ isDraggingOver: boolean }>`
  background-color: ${(props) => (props.isDraggingOver ? 'lightblue' : 'white')};
  height: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

interface DashboardProps {
  id: string;
  name: string;
  index: number;
  contents: { text: string; id: string }[];
  createContent: (name: string) => void;
  deleteContent: (id: string) => void;
  onDelete: () => void;
}

export const Dashboard: FC<DashboardProps> = ({
  id,
  name,
  contents,
  index,
  createContent,
  deleteContent,
  onDelete,
}) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provider, snapshot) => (
        <DashboardStyled {...provider.draggableProps} ref={provider.innerRef}>
          <h2 {...provider.dragHandleProps}>{name}</h2>
          {contents.length === 0 && <DeleteButton onClick={onDelete}>Delete</DeleteButton>}
          <Droppable droppableId={id} type="content">
            {(provider, snapshot) => (
              <ContentList
                isDraggingOver={snapshot.isDraggingOver}
                ref={provider.innerRef}
                {...provider.droppableProps}
              >
                {contents.map((content, index) => (
                  <Content
                    onDelete={() => deleteContent(content.id)}
                    key={content.id}
                    id={content.id}
                    index={index}
                    text={content.text}
                  />
                ))}
                {provider.placeholder}
              </ContentList>
            )}
          </Droppable>

          <CreateContent create={createContent} />
        </DashboardStyled>
      )}
    </Draggable>
  );
};

const DeleteButton = styled.button`
  margin: 2px;
  background-color: #ff4d4d;
  color: white;
  font-size: 10px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  padding: 10px 5px;
  &:hover {
    background-color: #ff1414;
  }
`;
