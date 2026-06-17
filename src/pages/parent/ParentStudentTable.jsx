import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getGuardianChildren } from "../../services/portalDataService";
import { getCurrentUser } from "../../utils/authStorage";
import { getDisplayName, getGuardianId, getRecordId, normalizeCollectionResponse } from "../../utils/portalIdentity";

function ParentStudentTable({
  title = "Students Details",
  description = "Students associated with the current parent account.",
  actionPath = "/parent/children",
  actionLabel = "View",
}) {
  const [searchParams] = useSearchParams();
  const user = getCurrentUser();
  const guardianId = useMemo(() => getGuardianId(user), [user]);
  const selectedStudentId = searchParams.get("studentId");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [state, setState] = useState({ isLoading: true, error: "", children: [] });

  const loadChildren = useCallback(() => {
    if (!guardianId) {
      setState({ isLoading: false, error: "Unable to determine guardian profile from the current session.", children: [] });
      return Promise.resolve();
    }

    setState((currentState) => ({ ...currentState, isLoading: true, error: "" }));

    return getGuardianChildren(guardianId)
      .then((data) => {
        setState({ isLoading: false, error: "", children: normalizeCollectionResponse(data) });
      })
      .catch((fetchError) => {
        setState({ isLoading: false, error: fetchError.message || "Unable to load students.", children: [] });
      });
  }, [guardianId]);

  useEffect(() => {
    loadChildren();
  }, [loadChildren]);

  const filteredChildren = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return state.children;
    }

    return state.children.filter((child) =>
      [
        getDisplayName(child),
        child.school_name,
        child.school,
        child.class_name,
        child.class,
        child.stream_name,
        child.stream,
        child.admission_number,
        child.admission_no,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery)),
    );
  }, [state.children, searchQuery]);

  const visibleChildren = useMemo(() => filteredChildren.slice(0, pageSize), [filteredChildren, pageSize]);
  const totalEntries = state.children.length;
  const showingCount = visibleChildren.length;

  const buildActionUrl = (studentId) => {
    const separator = actionPath.includes("?") ? "&" : "?";
    return `${actionPath}${separator}studentId=${studentId}`;
  };

  return (
    <section className="data-panel">
      <div className="panel-header">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <button className="panel-action" type="button" onClick={loadChildren} disabled={state.isLoading}>
          {state.isLoading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {state.isLoading ? <p className="panel-note">Loading students...</p> : null}
      {!state.isLoading && state.error ? <p className="panel-note panel-note-error">{state.error}</p> : null}
      {!state.isLoading && !state.error && !state.children.length ? <p className="panel-note">No students were returned for this parent account.</p> : null}

      {!state.isLoading && !state.error && state.children.length ? (
        <div className="table-panel">
          <div className="table-controls">
            <label className="table-length">
              <span>Show</span>
              <select value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))}>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>entries</span>
            </label>

            <label className="table-search">
              <span>Search:</span>
              <input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />
            </label>
          </div>

          <div className="table-wrap">
            <table className="data-table student-detail-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Student Name</th>
                  <th>School</th>
                  <th>Class</th>
                  <th>Stream</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleChildren.map((child, index) => {
                  const studentId = getRecordId(child);

                  return (
                    <tr className={String(studentId) === selectedStudentId ? "selected-row" : ""} key={studentId || getDisplayName(child)}>
                      <td>{index + 1}</td>
                      <td>{getDisplayName(child)}</td>
                      <td>{child.school_name || child.school || child.tenant?.school_name || "-"}</td>
                      <td>{child.class_name || child.class || child.current_class || "-"}</td>
                      <td>{child.stream_name || child.stream || child.current_stream || "General"}</td>
                      <td>
                        <Link className="table-action-link" to={buildActionUrl(studentId)}>
                          {actionLabel}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <p>
              Showing {showingCount ? 1 : 0} to {showingCount} of {filteredChildren.length} entries
              {filteredChildren.length !== totalEntries ? ` (filtered from ${totalEntries} total entries)` : ""}
            </p>
            <div className="table-pagination" aria-label="Student table pagination">
              <button type="button" disabled>
                Previous
              </button>
              <button className="active" type="button" disabled>
                1
              </button>
              <button type="button" disabled>
                Next
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default ParentStudentTable;
