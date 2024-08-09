import { useState } from 'react';
import Providers from '../pages/Providers.js';
import Clients from '../pages/Clients.js';
import Actions from './Actions.js';
import Articles from '../pages/Articles.js';

const tabsData = [
  {
    label: 'Clients',
    content: <Clients />
  },
  {
    label: 'Providers',
    content: <Providers />
  },
  {
    label: 'Articles',
    content: <Articles />
  },
  {
    label: 'Collections',
    content:
      'Fugiat dolor et quis in incididunt aute. Ullamco voluptate consectetur dolor officia sunt est dolor sint.',
  },
  {
    label: 'Payments',
    content:
      'Fugiat dolor et quis in incididunt aute. Ullamco voluptate consectetur dolor officia sunt est dolor sint.',
  },
  {
    label: 'Made Bills',
    content:
      'Fugiat dolor et quis in incididunt aute. Ullamco voluptate consectetur dolor officia sunt est dolor sint.',
  },
  {
    label: 'Received Bills',
    content:
      'Fugiat dolor et quis in incididunt aute. Ullamco voluptate consectetur dolor officia sunt est dolor sint.',
  },
  {
    label: 'Management Docs (clients)',
    content:
      'Fugiat dolor et quis in incididunt aute. Ullamco voluptate consectetur dolor officia sunt est dolor sint.',
  },
  {
    label: 'Management Docs (Providers)',
    content:
      'Fugiat dolor et quis in incididunt aute. Ullamco voluptate consectetur dolor officia sunt est dolor sint.',
  },
];

export function Tabs() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  return (
    <div>
        
      <div className="flex border-b">
        {/* Loop through tab data and render button for each. */}
        {tabsData.map((tab, idx) => {
          return (
            <button
              key={idx}
              className={`py-3 px-4 transition-colors duration-300 bg-gray-50 ${
                idx === activeTabIndex
                  ? 'bg-red-700 border-red-700 text-white'
                  : 'hover:bg-red-700 hover:text-white'
              }`}
              // Change the active tab on click.
              onClick={() => setActiveTabIndex(idx)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {/* Show active tab content. */}

      <Actions />
      <div>
        <>{tabsData[activeTabIndex].content}</>
      </div>
    </div>
  );
}
