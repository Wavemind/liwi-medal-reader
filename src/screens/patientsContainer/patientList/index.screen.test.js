/* eslint-disable */
import * as React from 'react';
import renderer from 'react-test-renderer';
// setup file
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { JestWithContext } from '../../../utils/jest/JestConfig.component';
import PatientList from './PatientList.screen';
import { jestWithAllProps } from '../../../utils/jest/JestDefaultProps';

configure({ adapter: new Adapter() });
/*
 * https://medium.com/@AidThompsin/heres-how-you-unit-test-textinput-with-react-native-63e1f7692b17
 * https://www.freecodecamp.org/news/components-testing-in-react-what-and-how-to-test-with-jest-and-enzyme-7c1cace99de5/
 * */

describe('PatientList', () => {
  it('test component ', async () => {
    const component = renderer.create(<PatientList {...jestWithAllProps} />);

    const componentContext = renderer.create(
      <JestWithContext child={PatientList} />
    );
    // can connect context but not easy to interact with PatientList
    // cant connect redux
    const instance = component.getInstance();
    await instance.filterMedicalCases();
    // cant use asyncstorage
    expect(component.toJSON()).toMatchSnapshot();
  });
});
