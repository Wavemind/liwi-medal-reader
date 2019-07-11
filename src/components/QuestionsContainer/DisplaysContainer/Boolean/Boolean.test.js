import * as React from 'react';
import Boolean from './Boolean';
import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';
// setup file
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
/*
 * https://medium.com/@AidThompsin/heres-how-you-unit-test-textinput-with-react-native-63e1f7692b17
 * https://www.freecodecamp.org/news/components-testing-in-react-what-and-how-to-test-with-jest-and-enzyme-7c1cace99de5/
 * */

test('renders patient list correctly', () => {
  const tree = renderer
    .create(
      <Boolean
        question={{
          id: 47,
          type: 'Question',
          reference: 'V1',
          description: null,
          label: 'MMR: 2 doses completed',
          answer: null,
          answers: {
            '91': {
              id: 91,
              reference: 'V1_1',
              label: 'Yes',
              value: null,
              operator: null,
            },
            '92': {
              id: 92,
              reference: 'V1_2',
              label: 'No',
              value: null,
              operator: null,
            },
          },
          category: 'vaccine',
          counter: 0,
          dd: [{ id: 16, conditionValue: false }],
          display_format: 'RadioButton',
          priority: 'basic',
          qs: [],
          value: 0,
          value_format: 'Boolean',
        }}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
