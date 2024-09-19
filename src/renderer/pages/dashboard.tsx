import { useAuth } from '../../auth/AuthProvider';
import Actions from '@renderer/components/actions';
import '@renderer/styles/dashboard.scss';
import { useState } from 'react';
import ClientsData from './clientsData';

const Dashboard = () => {
  const auth = useAuth();

  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const tabsData = [
    {
      label: 'Clients',
      // content: <Clients />
      content: <ClientsData />,
    },
    {
      label: 'Providers',
      // content: <Providers />
      content: 'providers section',
    },
    {
      label: 'Articles',
      content: 'articles section',
      // content: <Articles />
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

  return (
    <div className="container">
      <nav className="left-menu">
        <h1>Verial Software</h1>
        <button onClick={() => auth.logOut()} className="logout">
          logout
        </button>
      </nav>

      <nav className="right-menu">
        <div className="tabs">
          {/* Loop through tab data and render button for each. */}
          {tabsData.map((tab, idx) => {
            return (
              <button
                key={idx}
                className={` ${
                  idx === activeTabIndex ? 'active-tab' : 'inactive-tab'
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

        <section className="tab-content">
          <Actions />
          <div>
            <>{tabsData[activeTabIndex].content}</>
          </div>
        </section>
      </nav>
    </div>
  );
};

export default Dashboard;
