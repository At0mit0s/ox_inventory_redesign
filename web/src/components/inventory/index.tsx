import React, { useEffect, useRef, useState } from 'react';
import useNuiEvent from '../../hooks/useNuiEvent';
import InventoryControl from './InventoryControl';
import InventoryHotbar from './InventoryHotbar';
import { useAppDispatch } from '../../store';
import { refreshSlots, setAdditionalMetadata, setupInventory } from '../../store/inventory';
import { useExitListener } from '../../hooks/useExitListener';
import type { Inventory as InventoryProps } from '../../typings';
import RightInventory from './RightInventory';
import LeftInventory from './LeftInventory';
import Tooltip from '../utils/Tooltip';
import { closeTooltip } from '../../store/tooltip';
import InventoryContext from './InventoryContext';
import { closeContextMenu } from '../../store/contextMenu';
import Fade from '../utils/transitions/Fade';

import { useAppSelector } from '../../store';
import { selectRightInventory } from '../../store/inventory';


const Inventory: React.FC = () => {
  const [inventoryVisible, setInventoryVisible] = useState(false);
  const rightInventory = useAppSelector(selectRightInventory);
  const [canShow, setCanShow] = useState(false)
  const dispatch = useAppDispatch();

  useNuiEvent<boolean>('setInventoryVisible', setInventoryVisible);
  useNuiEvent<false>('closeInventory', () => {
    setInventoryVisible(false);
    dispatch(closeContextMenu());
    dispatch(closeTooltip());
  });
  useExitListener(setInventoryVisible);

   useEffect(() => {
      if (rightInventory.type === 'stash') {
      setCanShow(true);
    } else {
      const hasItems = rightInventory.items.some((el) => el.name);
      setCanShow(hasItems);
    }
  }, [rightInventory]);

  useNuiEvent<{
    leftInventory?: InventoryProps;
    rightInventory?: InventoryProps;
  }>('setupInventory', (data) => {
    dispatch(setupInventory(data));
    !inventoryVisible && setInventoryVisible(true);
  });

  useNuiEvent('refreshSlots', (data) => dispatch(refreshSlots(data)));

  useNuiEvent('displayMetadata', (data: Array<{ metadata: string; value: string }>) => {
    dispatch(setAdditionalMetadata(data));
  });

  return (
    <>
      <Fade in={inventoryVisible}>
        <div className='overlay'></div>
        <div className='logo'><img src='nui://ox_inventory/web/images/logo.png' alt="Inventory" /></div>
        <div className='leftShadow'></div>
        <div className='rightShadow'></div>
        <div className='topShadow'></div>
        {canShow && <div className='InventoryDivider'></div>}
        
        <div className="inventory-wrapper">
          <LeftInventory />
          <InventoryControl />
          {canShow && <RightInventory />}
          <Tooltip />
          <InventoryContext />
        </div>
      </Fade>
      <InventoryHotbar />
    </>
  );
};

export default Inventory;
