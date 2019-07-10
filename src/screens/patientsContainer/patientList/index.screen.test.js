import * as React from 'react';
import PatientList from './PatientList.screen';
import renderer from 'react-test-renderer';
import { JestWithContext } from '../../../utils/jest/JestConfig.component';
// setup file
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
/*
* https://medium.com/@AidThompsin/heres-how-you-unit-test-textinput-with-react-native-63e1f7692b17
* https://www.freecodecamp.org/news/components-testing-in-react-what-and-how-to-test-with-jest-and-enzyme-7c1cace99de5/
* */

test('renders patient list correctly', () => {
  const tree = renderer
    .create(<JestWithContext child={PatientList} />)
    .toJSON();

  // const ModalWrapperComponent = shallow(<JestWithContext child={PatientList} />);
  // expect(ModalWrapperComponent).toMatchSnapshot();
  expect(tree).toMatchSnapshot();
  // expect(tree).toBeTruthy();
});
