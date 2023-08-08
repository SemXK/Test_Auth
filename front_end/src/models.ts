export interface Dashboard {
  id: string;
  name: string;
  position: number;
  contents: Content[];
}

export interface Content {
  id: string;
  position: number;
  text: string;
  dashboardId: string;
}

export const data: Dashboard[] = [
  {
    id: 'ckm0w9ba10019km5ctdf11cb8',
    name: 'dashboard 2',
    position: 0,
    contents: [
      {
        id: 'ckm0w9b9v0001km5cv8j26xcj',
        text: 'ciao a tutti',
        position: 0,
        dashboardId: 'ckm0w9ba10019km5ctdf11cb8',
      },
      {
        id: 'ckm0w9ba10020km5c44n29xyr',
        text: 'ciao Lacerba',
        position: 1,
        dashboardId: 'ckm0w9ba10019km5ctdf11cb8',
      },
      {
        id: 'ckm0w9ba10021km5cwe4g19et',
        text: 'TODO',
        position: 2,
        dashboardId: 'ckm0w9ba10019km5ctdf11cb8',
      },
    ],
  },
  {
    id: 'ckm0w9ba40038km5cknwgo3bf',
    name: 'dashboard 3',
    position: 1,
    contents: [],
  },
  {
    id: 'ckm0w9b9v0000km5cm2o4mhrx',
    name: 'dashboard 1',
    position: 2,
    contents: [
      {
        id: 'ckm0w9b9v0002km5c83zp3ttf',
        text: 'qualcosa da fare',
        position: 0,
        dashboardId: 'ckm0w9b9v0000km5cm2o4mhrx',
      },
    ],
  },
  {
    id: 'ckm0w9ba50045km5cuwgdw3ee',
    name: 'dashboard 4',
    position: 3,
    contents: [],
  },
  {
    id: 'ckm0w9ba70052km5ci9n7h3vm',
    name: 'dashboard 5',
    position: 4,
    contents: [],
  },
];
