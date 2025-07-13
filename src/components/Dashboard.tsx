import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import strapiAPI from '../lib/api';

const Dashboard: FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await strapiAPI.get<any>('admin/dashboard');
        setStats(response.stats);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Clients</h2>
            <p>Total: {stats.clients.total}</p>
            <p>New this week: {stats.clients.new_this_week}</p>
            <p>New this month: {stats.clients.new_this_month}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Applications</h2>
            <p>Total: {stats.applications.total}</p>
            <p>Pending: {stats.applications.pending}</p>
            <p>Processing: {stats.applications.processing}</p>
            <p>Completed: {stats.applications.completed}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Content</h2>
            <p>Posts: {stats.content.posts}</p>
            <p>Travel Packages: {stats.content.travel_packages}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Products</h2>
            <p>Total: {stats.products.total}</p>
            <p>eSIMs: {stats.products.esims}</p>
            <p>Services: {stats.products.services}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Orders</h2>
            <p>Total: {stats.orders.total}</p>
            <p>Pending: {stats.orders.pending}</p>
            <p>Completed: {stats.orders.completed}</p>
          </div>
          <Link to="/clients" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">View Clients</h2>
            <p>Click to view and manage clients</p>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
