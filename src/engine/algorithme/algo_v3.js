export const questions = {
  e_1: {
    id: 'e_1',
    priority: 'triage',
    label: 'Age',
    category: 'exposure',
    question_type: 'numeric',
    answers: [
      {
        id: 'e_1_1',
        label: ' < 6 month',
        operator: '<',
        value: 6,
      },
      {
        id: 'e_1_2',
        label: ' < 6 month',
        operator: '<',
        value: 6,
      },
      {
        id: 'e_1_3',
        label: ' < 6 month',
        operator: '<',
        value: 6,
      },
      {
        id: 'e_1_4',
        label: ' < 6 month',
        operator: '<',
        value: 6,
      },
      {
        id: 'e_1_5',
        label: ' < 6 month',
        operator: '<',
        value: 6,
      },
    ],
  },
  e_2: {
    id: 'e_2',
    priority: 'normal',
    label: 'No Vit A in the past month',
    category: 'exposure',
    question_type: 'boolean',
    answers: [
      {
        e_2_1: {
          id: 'e_2_1',
          label: 'Yes',
          value: true,
        },
      },
      {
        e_2_2: {
          id: 'e_2_2',
          label: 'No',
          value: false,
        },
      },
    ],
  },
  p_3: {
    id: 'p_3',
    priority: 'triage',
    label: 'respiratory rate (RR)',
    category: 'physicalExam',
    question_type: 'numeric',
    answers: [
      {
        id: 'p_3_1',
        label: '  >= 70th%ile',
        operator: ['>=', '<'],
        value: [70, 97],
      },
      {
        id: 'p_3_2',
        label: '>= 97th%ile',
        operator: '>=',
        value: 97,
      },
      {
        id: 'p_3_3',
        label: '< 70th%ile',
        operator: '70',
        value: 70,
      },
    ],
  },
  s_1: {
    id: 's_2',
    priority: 'priority',
    label: 'Caugh',
    category: 'symptoms',
    question_type: 'boolean',
    answers: [
      {
        id: 's_2_1',
        label: 'True',
        value: true,
      },
      {
        id: 's_2_2',
        label: 'False',
        value: false,
      },
    ],
  },
  s_2: {
    id: 's_2',
    priority: 'priority',
    label: 'Caugh',
    category: 'symptoms',
    question_type: 'boolean',
    answers: [
      {
        id: 's_2_1',
        label: 'True',
        value: true,
      },
      {
        id: 's_2_2',
        label: 'False',
        value: false,
      },
    ],
  },
};

export const predifinedSyndroms = {
  ps_4: {
    id: 'ps_4',
    label: 'Fever',
    nodes: {
      s_2: {
        id: 's_2',
        conditions: null,
        children: ['p_3', 'p_16'],
      },
      p_3: {
        id: 'p_3',
        conditions: {
          nodes: [
            {
              id: 's_2',
              expected: 's_2_1',
            },
          ],
          operator: null,
        },
        children: ['ps_4'],
      },
      p_15: {
        id: 'p_15',
        conditions: null,
        children: ['ps_4'],
      },
      p_16: {
        id: 'p_16',
        conditions: {
          nodes: [
            {
              id: 's_2',
              expected: 's_2_1',
            },
          ],
          operator: null,
        },
        children: ['ps_4'],
      },
      p_17: {
        id: 'p_15',
        conditions: null,
        children: ['ps_4'],
      },
    },
    result: {
      conditions: {
        ids: ['p_3_1', 'p_15_1', 'p_16_1', 'p_17_1'],
        operator: ['OR', 'OR', 'OR'],
      },
    },
  },
};

export const diseases = {
  df_1: {
    id: 'df_1',
    name: 'Measles',
    differential: null,
    nodes: {
      e_1: { id: 'e_1', conditions: null, children: ['ps_1'] },
      ps_1: {
        id: 'ps_1',
        conditions: {
          nodes: [
            {
              id: 'e_1',
              expected: 'e_1_4',
            },
          ],
          operator: null,
        },
        children: ['ps_3'],
      },
      ps_3: {
        id: 'ps_3',
        conditions: {
          nodes: [
            {
              id: 'ps_1',
              expected: true,
            },
          ],
          operator: null,
        },
        children: ['ps_4', 'df_1', 'c_1'],
      },
      ps_4: {
        id: 'ps_4',
        conditions: {
          nodes: [
            {
              id: 'ps_3',
              expected: true,
            },
          ],
          operator: null,
        },
        children: ['df_2'],
      },
      c_1: {
        id: 'c_1',
        conditions: {
          nodes: [
            {
              id: 'ps_3',
              expected: true,
            },
          ],
          operator: null,
        },
        children: ['df_2'],
      },
      diagnosis: {
        df_1: {
          name: 'Non-severe measles',
          treatments: [
            {
              t_8: {
                id: 't_8',
                conditions: null,
                operator: null,
              },
              t_11: {
                id: 't_11',
                conditions: null,
                operator: null,
              },
              t_12: {
                id: 't_12',
                conditions: ['e_1_3', 'e_2'],
                operator: ['AND'],
              },
            },
          ],
          managements: [
            {
              t_8: {
                id: 't_8',
                conditions: null,
                operator: null,
              },
            },
          ],
          conditions: {
            id: [
              {
                id: 'ps_3',
                expected: true,
              },
            ],
            operator: null,
          },
          excluding_diagnosis: ['df_2'],
        },
        df_2: {
          name: 'Severe measles',
          treatments: [
            {
              t_1_2: {
                id: 't_1_2',
                conditions: ['ps_6_1'],
                operator: null,
              },
              t_1_3: {
                id: 't_1_3',
                conditions: ['ps_6_2'],
                operator: null,
              },
              t_5: {
                id: 't_5',
                conditions: null,
                operator: null,
              },
              t_12: {
                id: 't_12',
                conditions: ['e_1_3', 'e_2'],
                operator: ['AND'],
              },
            },
          ],
          managements: null,
          conditions: {
            id: [
              {
                id: 'ps_4',
                expected: true,
              },
              {
                id: 'c_1',
                expected: true,
              },
            ],
            operator: ['OR'],
          },
        },
      },
    },
  },
};
