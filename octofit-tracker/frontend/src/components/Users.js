import { useCallback, useEffect, useMemo, useState } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const endpoint = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`;

  const loadUsers = useCallback(() => {
    setIsLoading(true);
    setError('');
    console.log('Users endpoint:', endpoint);

    fetch(endpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Users request failed: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Users data:', data);
        const normalizedData = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
            ? data.results
            : [];
        setUsers(normalizedData);
      })
      .catch((err) => {
        console.error('Users fetch error:', err);
        setError('Unable to load users from API.');
      })
      .finally(() => setIsLoading(false));
  }, [endpoint]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return users;
    }

    return users.filter((user) => JSON.stringify(user).toLowerCase().includes(term));
  }, [users, searchTerm]);

  const openDetails = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <section className="card data-card">
      <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
        <h2 className="h4 mb-0">Users</h2>
        <a className="link-primary endpoint-link" href={endpoint} target="_blank" rel="noreferrer">
          API endpoint
        </a>
      </div>
      <div className="card-body">
        <form className="row g-2 align-items-end mb-3" onSubmit={(event) => event.preventDefault()}>
          <div className="col-md-8">
            <label htmlFor="usersSearch" className="form-label">
              Search
            </label>
            <input
              id="usersSearch"
              type="text"
              className="form-control"
              placeholder="Filter users..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <div className="col-md-4 d-flex gap-2">
            <button type="button" className="btn btn-primary w-100" onClick={loadUsers}>
              {isLoading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </form>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Primary</th>
                <th scope="col">Secondary</th>
                <th scope="col">Raw Data</th>
                <th scope="col" className="text-end">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.id || user._id || index}>
                  <th scope="row">{index + 1}</th>
                  <td>{user.username || user.name || `User ${index + 1}`}</td>
                  <td>{user.email || user.team || user.role || '-'}</td>
                  <td className="json-cell">{JSON.stringify(user)}</td>
                  <td className="text-end">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => openDetails(user)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">User details</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setIsModalOpen(false)}
                  />
                </div>
                <div className="modal-body">
                  <pre className="mb-0">{JSON.stringify(selectedUser, null, 2)}</pre>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}
    </section>
  );
}

export default Users;