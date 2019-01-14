// __tests__/Intro-test.js
import * as React from 'react';
import renderer from 'react-test-renderer';
import Root from 'index';
import RootLayout from 'template/Layout.template';
import RootSessions from 'screens/session/RootSessions';

test('render Root', () => {
  const tree = renderer.create(<Root />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('render Root Layout', () => {
  const tree = renderer.create(<RootLayout />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('render Root Sessions', () => {
  const tree = renderer.create(<RootSessions />).toJSON();
  expect(tree).toMatchSnapshot();
});
