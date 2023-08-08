import styled from '@emotion/styled';
import { FC } from 'react';
import { Draggable } from 'react-beautiful-dnd';

const ContentStyled = styled.div<{ isDragging: boolean }>`
  font-size: 12px;
  padding: 5px;
  border: 1px solid #ccc;
  background-color: ${(props) => (props.isDragging ? 'lightgreen' : 'white')};
  margin: 2px;
  display: flex;
  justify-content: space-between;
`;

interface ContentProps {
  text: string;
  id: string;
  index: number;
  onDelete: () => void;
}

export const Content: FC<ContentProps> = ({ text, id, index, onDelete }) => {
  return (
    <div>
      <Draggable draggableId={id} index={index}>
        {(provided, snaphshot) => (
          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
            <ContentStyled isDragging={snaphshot.isDragging}>
              <span>{text}</span>
              <DeleteButton onClick={onDelete}> x </DeleteButton>
            </ContentStyled>
          </div>
        )}
      </Draggable>
    </div>
  );
};

const DeleteButton = styled.button`
  background-color: #ff4d4d;
  color: white;
  font-size: 15px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  width: 20px;
  height: 20px;
  display: grid;
  place-content: center;
  margin: 0;
  padding: 0;
  &:hover {
    background-color: #ff1414;
  }
`;
