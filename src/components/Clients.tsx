import { FC, useEffect, useState } from 'react';
import strapiAPI from '../lib/api';
import { Client } from '../lib/types';

const Clients: FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const response = await strapiAPI.get<any>(`clients?page=${page}`);
        setClients(response.clients);
        setPagination(response.pagination);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [page]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Clients</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Name</th>
              <th className="text-left">Email</th>
              <th className="text-left">Phone</th>
              <th className="text-left">Country</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>{client.first_name} {client.last_name}</td>
                <td>{client.email}</td>
                <td>{client.phone}</td>
                <td>{client.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && (
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setPage(page - 1)}
            disabled={!pagination.has_prev}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span>Page {pagination.page} of {pagination.pages}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={!pagination.has_next}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Clients;
