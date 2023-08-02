import { Content, Dashboard, PrismaClient } from "@prisma/client";

export class DashboardService {
  constructor(private readonly prisma: PrismaClient) {}   //use prisma module from the cunstructor
  
  //Dashboard methods
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

  async moveDashboard(userId: string,  dashboardId:string, position: number ): Promise<boolean> {
    const dashboards = await this.prisma.dashboard.findMany({  //Store all 'Dashboard' instances in a variable
      where: {
        userId: userId,
      },
      // orderBy: {
      //   position: 'asc'         //Pretty clear
      // },
    });
    // if(position >= dashboards.length) {
    //   console.log('primo')
    //   return false
    // }
    const oldPosition = dashboards.findIndex(d => d.id === dashboardId)
    if(oldPosition === -1) {
      return false;
    }
    const [ dashboard ] = dashboards.splice(oldPosition, 1);
    dashboards.splice(position, 0, dashboard)
    await this.reorderDashboard(dashboards)
    return true
  };

  private async reorderDashboard(dashboards: Dashboard[]) {
    const updates = dashboards.map((dashboard, index) => {  //Store the reorder of the DB as multiple instances
      return this.prisma.dashboard.update({
        where:{
          id: dashboard.id
        },
        data: {
          position: index,      //Refresh the id of every dashboard instance 0 -> n
        },
      });
    });
    await this.prisma.$transaction(updates);   //Launch every instance at the same time
  }

  async createDashboard(userId: string, name: string) {
    const countDashboard = await this.prisma.dashboard.count();   //Count the number of Dashboards
    await this.prisma.dashboard.create({
      data:{
        position: countDashboard,         //put this dashboard as the last instance of dashboard models
        name: name,
        userId: userId
      },
    });
    return true;
  }

  
  async deleteDashboard(userId: string, dashboardId: string) {
    const dashboard = await this.getSingleDashboard(userId, dashboardId);  //Check if the instance of 'Dashboard' belongs to the user with id of 'userId'
    if(!dashboard) {
      return null;
    }
    const contentsInDashboard = await this.prisma.content.count({ //Check if the dashboard is empty
      where:{
        dashboardId: dashboardId
      }
    })
    if(contentsInDashboard > 0) { //if the dashboard is not empty, dont do anything
      return null                 //a dashboard can be deleted ONLY if it's empty
    }
    await this.prisma.dashboard.delete({
      where:{
        id: dashboardId,      
      },
    });
    const dashboards = await this.prisma.dashboard.findMany({  //Store all 'Dashboard' instances in a variable
      orderBy: {
        position: 'asc'         //Pretty clear
      },
    });
    await this.reorderDashboard(dashboards) //reorder the model after removing an istance
    return true;
  }
  //Contents methods

  async moveContent( 
    userId: string,                                   //Arguments of the function
    contentId: string,                                //Arguments of the function
    position: number,                                 //Arguments of the function
    fromDashboardId: string,                          //Arguments of the function
    toDashboardId: string ): Promise<boolean> {       //Arguments of the function and it's return type

    const fromToSameDashboard = fromDashboardId === toDashboardId //Check if a content did not change it's dashboard

    const fromDashboard = await this.getSingleDashboard(userId, fromDashboardId);  //Check if the instance of 'Dashboard' belongs to the user with id of 'userId'
    if(!fromDashboard) {
      return false;
    }
    if(!fromToSameDashboard) {   
      const toDashboard = await this.getSingleDashboard(userId, toDashboardId);  //Check if the instance of 'Dashboard' belongs to the user with id of 'userId'
      if(!toDashboard) {
        return false;
      }
    }


    const fromContents = await this.prisma.content.findMany({  //Get the content that will switch....
      orderBy: {
        position: 'asc'         //Pretty clear
      },
      where:{
        dashboardId: fromDashboardId              //...from this dashboard....
      }
    });   
  
    const toContents = fromToSameDashboard?
      fromContents :  await this.prisma.content.findMany({  //IF an item did not change it's dashboard, we store it in the  same instance of Dash
      orderBy: {
        position: 'asc'         //Pretty clear
      },
      where:{
        dashboardId: toDashboardId                  //...to this dashboard
      }
    });
    if(position >= toContents.length) {
      return false
    }
    const oldPosition = fromContents.findIndex(c => c.id === contentId)
    if(oldPosition === -1) {
      return false;
    }
    const [ content ] = fromContents.splice(oldPosition, 1);
    toContents.splice(position, 0, content)
    await this.reorderContent(fromContents, fromDashboardId)
    if(!fromToSameDashboard) {
      await this.reorderContent(toContents, toDashboardId)  //if fromDash and toDash are the same instance, we dont reorder it 2 times
    }
    return true
  };

  async createContent(userId: string, dashboardId: string, text: string) {
    const dashboard = await this.getSingleDashboard(userId, dashboardId)  //Check if the instance of 'Dashboard' belongs to the user with id of 'userId'
    if(!dashboard)  { //Check if the 'Dashboard' instance is empty
      return null; 
    }
    const countContent = await this.prisma.content.count({
      where: {
        dashboardId: dashboardId      //Check how many contents does the selecteed Dashboard have
      },
    });
    return await this.prisma.content.create({
      data:{
        position: countContent,         //Put the new Content as the last item of the Dashboard
        text: text,
        dashboardId: dashboardId,
      },
    });
    
  }

  async deleteContent(userId: string, dashboardId: string, contentId: string) {
    const dashboard = await this.getSingleDashboard(userId, dashboardId);  //Check if the instance of 'Dashboard' belongs to the user with id of 'userId'
    if(!dashboard) {
      return null;
    }
    const deleted = await this.prisma.content.delete({
      where:{
        id: contentId,                //Delete a single istance of Content....
        dashboardId: dashboardId     //...from a specified Dashboard istance
      },
    });
    const dashboards = await this.prisma.dashboard.findMany({  //Store all 'Dashboard' instances in a variable
      orderBy: {
        position: 'asc'         //Pretty clear
      },
    });
    await this.reorderDashboard(dashboards) //reorder the model after removing an istance

    const allContents = await this.prisma.content.findMany({
      where: {
        dashboardId: dashboardId
      },
    });
    await this.reorderContent(allContents, dashboardId)
    return deleted;
  }

  private async reorderContent(contents: Content[], dashboardId:string) {
    const updates = contents.map((content, index) => {  //Store the reorder of the DB as multiple instances
      return this.prisma.content.update({
        where:{
          id: content.id
        },
        data: {
          position: index,
          dashboardId: dashboardId,
        },
      });
    });
    await this.prisma.$transaction(updates);   //Launch every instance at the same time
  }

  getSingleDashboard(userId:string, dashboardId:string) {
    return this.prisma.dashboard.findUnique({
      where:{
        id_userId: {
          id: dashboardId, //Get a dashboard from a user with this id, this relation has been added from prisma models
          userId: userId
        }
      }
    });
  }
}