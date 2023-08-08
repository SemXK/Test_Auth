import styled from '@emotion/styled';
import { Dashboard } from '../components/dashboard';
import { Dashboard as DashboardModel } from '../models';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useEffect, useState } from 'react';
import { apiService } from '../services';
import { CreateDashboard } from '../components/create-dashboard';

const StyledApp = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  min-width: 400px;
  overflow-y: scroll;
`;

export function Dashboards() {
  const [dashboards, setDashboards] = useState<DashboardModel[]>([]);
  useEffect(() => {
    async function getDashboard() {
      const dashboards = await apiService.getDashboards();
      setDashboards(dashboards);
    }
    getDashboard();
  }, []);

  async function onDashboardDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }
    const position = result.destination.index;
    const dashboardId = result.draggableId;
    const dashboards = await apiService.moveDashboard(dashboardId, position);
    setDashboards(dashboards);
  }

  async function creatContent(name: string, dashboardId: string) {
    const dashboards = await apiService.createContent(name, dashboardId);
    setDashboards(dashboards);
  }

  async function creatDashboard(name: string) {
    const dashboards = await apiService.createDashboard(name);
    setDashboards(dashboards);
  }

  async function deleteContent(contentId: string, dashboardId: string) {
    const dashboards = await apiService.deleteContent(contentId, dashboardId);
    setDashboards(dashboards);
  }

  async function deleteDashboard(dashboardId: string) {
    const dashboards = await apiService.deleteDashboard(dashboardId);
    setDashboards(dashboards);
  }

  async function onContentDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }
    const srcDashboardId = result.source.droppableId;
    const contentId = result.draggableId;
    const destDashboardId = result.destination.droppableId;
    const position = result.destination.index;
    const dashboards = await apiService.moveContent(srcDashboardId, contentId, destDashboardId, position);
    setDashboards(dashboards);
  }

  async function onDragEnd(result: DropResult) {
    const type = result.type;
    if (type === 'DASHBOARD') {
      await onDashboardDragEnd(result);
    } else if (type === 'content') {
      await onContentDragEnd(result);
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list" direction="horizontal" type="DASHBOARD">
        {(provided) => (
          <StyledApp ref={provided.innerRef} {...provided.droppableProps}>
            {dashboards.map((dashboard, index) => (
              <Dashboard
                deleteContent={(contentId) => deleteContent(contentId, dashboard.id)}
                createContent={(name: string) => creatContent(name, dashboard.id)}
                onDelete={() => deleteDashboard(dashboard.id)}
                index={index}
                {...dashboard}
                key={dashboard.id}
              />
            ))}
            {provided.placeholder}
            <CreateDashboard onCreate={(name) => creatDashboard(name)} />
          </StyledApp>
        )}
      </Droppable>
    </DragDropContext>
  );
}
