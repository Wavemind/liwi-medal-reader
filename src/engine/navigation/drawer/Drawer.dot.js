/**
 * The extertnal dependencies
 */
import React from 'react';
import styled from 'styled-components';

const ListItemDot = styled.TouchableOpacity`
  position: relative;
  margin-right: 10px;
  margin-left: ${({ isDrawer }) => (isDrawer ? '1px' : '6px')};
`;

const ListItemDotOuter = styled.View`
  width: 28px;
  height: 28px;
  border-radius: 50;
  border-width: 3px;
  border-color: ${({ color }) => color};
`;

const ListItemDotInner = styled.View`
  width: 14px;
  height: 14px;
  position: absolute;
  top: 7px;
  left: 7px;
  background-color: ${({ color }) => color};
  border-radius: 50;
`;

const DrawerDot = ({ type, onPress, isDrawer }) => {
  let dotColor = '#d8d8d8';
  let borderColor = '#d8d8d8';

  if (type && type === 'active') {
    dotColor = '#db473e';
    borderColor = '#db473e';
  }

  if (type && type === 'passed') {
    dotColor = '#7cb61e';
  }

  return (
    <ListItemDot onPress={onPress} isDrawer={isDrawer}>
      <ListItemDotOuter color={borderColor} />
      <ListItemDotInner color={dotColor} />
    </ListItemDot>
  );
};

export default DrawerDot;
