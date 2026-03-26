import { useCallback, useEffect, useMemo, useState } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const endpoint = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`;

  const loadActivities = useCallback(() => {
    setIsLoading(true);
    setError('');
    console.log('Activities endpoint:', endpoint);

    fetch(endpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Activities request failed: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Activities data:', data);
        const normalizedData = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
            ? data.results
            : [];
        setActivities(normalizedData);
      })
      .catch((err) => {
        console.error('Activities fetch error:', err);
        setError('Unable to load activities from API.');
      })
      .finally(() => setIsLoading(false));
  }, [endpoint]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const filteredActivities = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return activities;
    }

    return activities.filter((activity) =>
      JSON.stringify(activity).toLowerCase().includes(term)
    );
  }, [activities, searchTerm]);

  const openDetails = (activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  return (
    <section className="card data-card">
      <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
        <h2 className="h4 mb-0">Activities</h2>
        <a className="link-primary endpoint-link" href={endpoint} target="_blank" rel="noreferrer">
          API endpoint
        </a>
      </div>
      <div className="card-body">
        <form className="row g-2 align-items-end mb-3" onSubmit={(event) => event.preventDefault()}>
          <div className="col-md-8">
            <label htmlFor="activitiesSearch" className="form-label">
              Search
            </label>
            <input
              id="activitiesSearch"
              type="text"
              className="form-control"
              placeholder="Filter activities..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <div className="col-md-4 d-flex gap-2">
            <button type="button" className="btn btn-primary w-100" onClick={loadActivities}>
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
              {filteredActivities.map((activity, index) => (
                <tr key={activity.id || activity._id || index}>
                  <th scope="row">{index + 1}</th>
                  <td>{activity.name || activity.title || `Activity ${index + 1}`}</td>
                  <td>{activity.type || activity.category || activity.user || '-'}</td>
                  <td className="json-cell">{JSON.stringify(activity)}</td>
                  <td className="text-end">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => openDetails(activity)}
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
                  <h5 className="modal-title">Activity details</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setIsModalOpen(false)}
                  />
                </div>
                <div className="modal-body">
                  <pre className="mb-0">{JSON.stringify(selectedActivity, null, 2)}</pre>
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

export default Activities;