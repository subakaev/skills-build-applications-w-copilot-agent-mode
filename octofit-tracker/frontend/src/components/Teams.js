import { useCallback, useEffect, useMemo, useState } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const endpoint = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;

  const loadTeams = useCallback(() => {
    setIsLoading(true);
    setError('');
    console.log('Teams endpoint:', endpoint);

    fetch(endpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Teams request failed: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Teams data:', data);
        const normalizedData = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
            ? data.results
            : [];
        setTeams(normalizedData);
      })
      .catch((err) => {
        console.error('Teams fetch error:', err);
        setError('Unable to load teams from API.');
      })
      .finally(() => setIsLoading(false));
  }, [endpoint]);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  const filteredTeams = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return teams;
    }

    return teams.filter((team) => JSON.stringify(team).toLowerCase().includes(term));
  }, [teams, searchTerm]);

  const openDetails = (team) => {
    setSelectedTeam(team);
    setIsModalOpen(true);
  };

  return (
    <section className="card data-card">
      <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
        <h2 className="h4 mb-0">Teams</h2>
        <a className="link-primary endpoint-link" href={endpoint} target="_blank" rel="noreferrer">
          API endpoint
        </a>
      </div>
      <div className="card-body">
        <form className="row g-2 align-items-end mb-3" onSubmit={(event) => event.preventDefault()}>
          <div className="col-md-8">
            <label htmlFor="teamsSearch" className="form-label">
              Search
            </label>
            <input
              id="teamsSearch"
              type="text"
              className="form-control"
              placeholder="Filter teams..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <div className="col-md-4 d-flex gap-2">
            <button type="button" className="btn btn-primary w-100" onClick={loadTeams}>
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
              {filteredTeams.map((team, index) => (
                <tr key={team.id || team._id || index}>
                  <th scope="row">{index + 1}</th>
                  <td>{team.name || team.title || `Team ${index + 1}`}</td>
                  <td>{team.coach || team.lead || team.city || '-'}</td>
                  <td className="json-cell">{JSON.stringify(team)}</td>
                  <td className="text-end">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => openDetails(team)}
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
                  <h5 className="modal-title">Team details</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setIsModalOpen(false)}
                  />
                </div>
                <div className="modal-body">
                  <pre className="mb-0">{JSON.stringify(selectedTeam, null, 2)}</pre>
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

export default Teams;