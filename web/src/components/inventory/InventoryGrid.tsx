import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Inventory } from '../../typings';
import WeightBar from '../utils/WeightBar';
import InventorySlot from './InventorySlot';
import { getTotalWeight } from '../../helpers';
import { useAppSelector } from '../../store';
import { useIntersection } from '../../hooks/useIntersection';

const PAGE_SIZE = 30;

import { GiHighGrass } from "react-icons/gi";
import { BsBoxFill } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { GiStoneCrafting } from "react-icons/gi";
import { FaFingerprint } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { FaCar } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import { FaHand } from "react-icons/fa6";

const ICONS = {
  'newdrop': <GiHighGrass />,
  'drop': <GiHighGrass />,
  'stash': <BsBoxFill />,
  'container': <BsBoxFill />,
  'policeevidence': <FaFingerprint />,
  'crafting': <GiStoneCrafting />,
  'shop': <FaCartShopping />,
  'inspect': <FaSearch />,
  'glovebox': <FaCar />,
  'otherplayer': <FaUserAlt />,
  'player': <FaHand />,
}

const InventoryGrid: React.FC<{ inventory: Inventory }> = ({ inventory }) => {
  const weight = useMemo(
    () => (inventory.maxWeight !== undefined ? Math.floor(getTotalWeight(inventory.items) * 1000) / 1000 : 0),
    [inventory.maxWeight, inventory.items]
  );
  const [page, setPage] = useState(0);
  const containerRef = useRef(null);
  const { ref, entry } = useIntersection({ threshold: 0.5 });
  const isBusy = useAppSelector((state) => state.inventory.isBusy);

  useEffect(() => {
    if (entry && entry.isIntersecting) {
      setPage((prev) => ++prev);
    }
  }, [entry]);
  return (
    <>
      <div className="inventory-grid-wrapper" style={{ pointerEvents: isBusy ? 'none' : 'auto' }}>
        <div>
          <div className="inventory-grid-header-wrapper">
            <div className='playerLabel'>
              <div className='icon'>{ICONS[inventory.type as keyof typeof ICONS]}</div>
              <div>{inventory.label}</div>
            </div>
            {inventory.maxWeight && (
              <p>
                {weight / 1000} / <span className='weightSpawn'>{inventory.maxWeight / 1000}kg</span>
              </p>
            )}
          </div>
          <WeightBar percent={inventory.maxWeight ? (weight / inventory.maxWeight) * 100 : 0} />
        </div>
        <div className="inventory-grid-container" ref={containerRef}>
          <>
            {inventory.items.slice(0, (page + 1) * PAGE_SIZE).map((item, index) => (
              <InventorySlot
                key={`${inventory.type}-${inventory.id}-${item.slot}`}
                item={item}
                ref={index === (page + 1) * PAGE_SIZE - 1 ? ref : null}
                inventoryType={inventory.type}
                inventoryGroups={inventory.groups}
                inventoryId={inventory.id}
              />
            ))}
          </>
        </div>
      </div>
    </>
  );
};

export default InventoryGrid;
