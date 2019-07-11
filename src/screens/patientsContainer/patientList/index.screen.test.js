import * as React from 'react';
import PatientList from './PatientList.screen';
import renderer from 'react-test-renderer';
import { AsyncStorage } from 'react-native';
import { JestWithContext } from '../../../utils/jest/JestConfig.component';
import { shallow, mount } from 'enzyme';
// setup file
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
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
    console.log(component.root);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
