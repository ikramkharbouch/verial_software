import Statistics from '@renderer/stats/statistics';
import React from 'react';

function DashboardMemoized() {

  return (
    <Statistics />
  );
}

const Dashboard = React.memo(DashboardMemoized);

export default Dashboard;
