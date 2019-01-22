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
        condition: null,
        children: ['p_3', 'p_16'],
      },
      p_3: {
        id: 'p_3',
        condition: {
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
        condition: null,
        children: ['ps_4'],
      },
      p_16: {
        id: 'p_16',
        condition: {
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
        condition: null,
        children: ['ps_4'],
      },
    },
    result: {
      condition: {
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
    // Tout est noeuds
    // Factory pour gérer les types de noeuds et réagir en fonction
    // e_1 est déclaré plusieurs fois ! comment définir 2 branches différentes à différents endroit pour différentes réponses...
    nodes: {
      e_1: { id: 'e_1', condition: null, children: ['ps_1'] },
      ps_1: {
        id: 'ps_1',
        condition: {
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
        condition: {
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
        condition: {
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
        condition: {
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
      df_1: {
        id: 'df_1',
        condition: {
          nodes: [
            {
              id: 'ps_3',
              expected: true,
            },
            {
              id: 'df_2',
              expected: false,
            },
          ],
          operator: ['AND'],
        },
        children: ['t_8', 't_11', 'e_1'],
      },
      df_2: {
        id: 'df_2',
        condition: {
          nodes: [
            {
              nodes: [
                {
                  id: 'ps_4',
                  expected: true,
                },
                {
                  id: 'df_1',
                  expected: false,
                },
              ],
              operator: ['AND'],
            },
            {
              nodes: [
                {
                  id: 'c_1',
                  expected: true,
                },
                {
                  id: 'df_1',
                  expected: false,
                },
              ],
              operator: ['AND'],
            },
          ],
          operator: 'OR',
        },
        children: ['ps_6', 't_5', 'e_1_3', 'e_2'], // Il y a un soucis ici
      },
      t_8: {
        id: 't_8',
        condition: {
          nodes: [
            {
              id: 'df_1',
              expected: true,
            },
          ],
          operator: null,
        },
        children: null,
      },
      t_11: {
        id: 't_11',
        condition: {
          nodes: [
            {
              id: 'df_1',
              expected: true,
            },
          ],
          operator: null,
        },
        children: ['m_1'],
      },
      t_12: {
        id: 't_12',
        condition: {
          nodes: [
            {
              id: 'e_2',
              expected: true,
            },
          ],
          operator: null,
        },
        children: null,
      },
      e_1_3: {
        id: 'e_2',
        condition: {
          nodes: [
            {
              id: 'e_1',
              expected: 'e_1_3',
            },
          ],
          operator: null,
        },
        children: ['t_12'],
      },
      ps_6: {
        id: 'ps_6',
        condition: {
          nodes: [
            {
              id: 'df_2',
              expected: true,
            },
          ],
          operator: null,
        },
        children: ['t_1_2', 't_1_3'],
      },
      t_1_2: {
        id: 't_1_2',
        condition: {
          nodes: [
            {
              id: 'ps_6',
              expected: 'ps_6_1',
            },
          ],
          operator: null,
        },
        children: null,
      },
      t_1_3: {
        id: 't_1_3',
        condition: {
          nodes: [
            {
              id: 'ps_6',
              expected: 'ps_6_2',
            },
          ],
          operator: null,
        },
        children: null,
      },
      t_5: {
        id: 't_5',
        condition: {
          nodes: [
            {
              id: 'df_2',
              expected: true,
            },
          ],
          operator: null,
        },
        children: null,
      },
      e_2: {
        id: 'e_2',
        condition: {
          nodes: [
            {
              id: 'e_1',
              expected: 'e_1_3',
            },
          ],
          operator: null,
        },
        children: ['t_12'],
      },
    },
  },
};
