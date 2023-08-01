import { Dashboard, PrismaClient } from "@prisma/client";

export class DashboardService {
  constructor(private readonly prisma: PrismaClient) {}   //use prisma module from the cunstructor

  getDashboards() {
    return this.prisma.dashboard.findMany({  //Store all 'Dashboard' instances in a variable
      orderBy: {
        position: 'asc'         //Pretty clear
      },
      include: {                //Add contents linked the every instance of 'Dashboard'
        contents: {
          orderBy:{
            position:'asc'      //Pretty clear
          },
        },  
      },
    });
  };

  async moveDashboard( dashboardId:string, position: number ): Promise<boolean> {
    const dashboards = await this.prisma.dashboard.findMany({  //Store all 'Dashboard' instances in a variable
      orderBy: {
        position: 'asc'         //Pretty clear
      },
    });
    if(position >= dashboards.length) {
      return false
    }
    const oldPosition = dashboards.findIndex(d => d.id === dashboardId)
    if(oldPosition === -1) {
      return false;
    }
    const [ dashboard ] = dashboards.splice(oldPosition, 1);
    dashboards.splice(position, 0, dashboard)
    await this.reorderDashboard(dashboards)
    return true
  };


  async reorderDashboard(dashboards: Dashboard[]) {
    const updates = dashboards.map((dashboard, index) => {  //Store the reorder of the DB as multiple instances
      return this.prisma.dashboard.update({
        where:{
          id: dashboard.id
        },
        data: {
          position: index,
        },
      });
    });
    await this.prisma.$transaction(updates);   //Launch every instance at the same time
  }
}