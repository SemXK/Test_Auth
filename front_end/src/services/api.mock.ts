import { Dashboard } from '../models';

let dashboards: Dashboard[] = [
  {
    id: 'ckm7nn93h0121r85cfw0k7hvm',
    name: 'asdasd',
    position: 0,
    contents: [
      { id: 'ckm7ogrcf06440q5cdy08pzsi', text: '2', position: 0, dashboardId: 'ckm7nn93h0121r85cfw0k7hvm' },
      { id: 'ckm7ojpvv01604t5cnsnl4k0s', text: '5', position: 1, dashboardId: 'ckm7nn93h0121r85cfw0k7hvm' },
    ],
  },
  {
    id: 'ckm0w9ba50045km5cuwgdw3ee',
    name: 'dashboard 4',
    position: 1,
    contents: [
      { id: 'ckm0w9ba10020km5c44n29xyr', text: 'ciao Lacerba', position: 0, dashboardId: 'ckm0w9ba50045km5cuwgdw3ee' },
      { id: 'ckm7m3ici0031s65cmyulhp53', text: 'asdasd', position: 1, dashboardId: 'ckm0w9ba50045km5cuwgdw3ee' },
    ],
  },
  {
    id: 'ckm7of1cc05370q5cq34eqnyj',
    name: 'asdasd',
    position: 2,
    contents: [
      { id: 'ckm7ok1cg03314t5cnjvj8s2m', text: 'asdsad', position: 0, dashboardId: 'ckm7of1cc05370q5cq34eqnyj' },
    ],
  },
  {
    id: 'ckm7ojxhs03004t5c4r9ffpvj',
    name: 'New Dashboard',
    position: 3,
    contents: [
      { id: 'ckm7ojzpm03154t5cosyq5wwc', text: 'adssad', position: 0, dashboardId: 'ckm7ojxhs03004t5c4r9ffpvj' },
    ],
  },
];

export class ApiService {
  constructor(private readonly url: string) {}

  getDashboards(): Promise<Dashboard[]> {
    return Promise.resolve(dashboards);
  }

  createContent(text: string, dashboardId: string) {
    const dashboard = dashboards.find((d) => d.id === dashboardId);
    if (dashboard) {
      dashboard?.contents.push({
        dashboardId: dashboardId,
        id: makeid(40),
        position: dashboard?.contents.length,
        text: text,
      });
    }
    return this.getDashboards();
  }

  createDashboard(name: string) {
    dashboards.push({
      contents: [],
      id: makeid(20),
      name: name,
      position: dashboards.length,
    });
    return this.getDashboards();
  }

  deleteContent(contentId: string, dashboardId: string) {
    const dashboard = dashboards.find((d) => d.id === dashboardId);
    if (dashboard) {
      dashboard.contents = dashboard.contents.filter((c) => c.id !== contentId);
    }
    return this.getDashboards();
  }

  deleteDashboard(dashboardId: string) {
    dashboards = dashboards.filter((d) => d.id !== dashboardId);
    return this.getDashboards();
  }

  moveDashboard(dashboardId: string, position: number): Promise<Dashboard[]> {
    const idx = dashboards.findIndex((d) => d.id === dashboardId);
    if (idx >= 0) {
      const [d] = dashboards.splice(idx, 1);
      dashboards.splice(position, 0, d);
    }
    return this.getDashboards();
  }

  moveContent(
    srcDashboardId: string,
    contentId: string,
    destDashboardId: string,
    position: number
  ): Promise<Dashboard[]> {
    return fetch(`${this.url}/${srcDashboardId}/${contentId}/move`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ position: position, dashboardId: destDashboardId }),
    }).then((res) => res.json());
  }
}

function makeid(length: number) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
