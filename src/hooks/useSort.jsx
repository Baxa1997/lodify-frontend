import { useState, useMemo } from 'react';

export const useSort = (items, config = null) => {
  const [sortConfig, setSortConfig] = useState(config);
  console.log('configconfig', config)

  const getValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };
  
  const sortedItems = useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        console.log('sortableItemssortableItems', sortableItems)
        const aValue = getValue(a, sortConfig.key);
        const bValue = getValue(b, sortConfig.key);
        console.log('aValueaValue', aValue, bValue)
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};