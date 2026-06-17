import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getBalanceStatement, getInvoices, getPayments, getStudentProfile } from "../../services/portalDataService";
import { getDisplayName, getRecordId } from "../../utils/portalIdentity";

function FinancePanel({ variant = "invoices" }) {
  const [searchParams] = useSearchParams();
  const selectedStudentId = searchParams.get("studentId");
  const [collectionState, setCollectionState] = useState({ isLoading: true, error: "", items: [] });
  const [statementState, setStatementState] = useState({ isLoading: false, error: "", statement: null });
  const [selectedStudent, setSelectedStudent] = useState(null);

  const loadCollection = useCallback(() => {
    setCollectionState({ isLoading: true, error: "", items: [] });

    const loader = variant === "payments" ? getPayments() : getInvoices();

    return loader
      .then((data) => {
        const items = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];
        setCollectionState({ isLoading: false, error: "", items });
      })
      .catch((fetchError) => {
        setCollectionState({ isLoading: false, error: fetchError.message || "Unable to load finance records.", items: [] });
      });
  }, [variant]);

  const loadStatement = useCallback((balanceId) => {
    if (!balanceId) {
      setStatementState({ isLoading: false, error: "", statement: null });
      return Promise.resolve();
    }

    setStatementState({ isLoading: true, error: "", statement: null });

    return getBalanceStatement(balanceId)
      .then((statement) => {
        setStatementState({ isLoading: false, error: "", statement });
      })
      .catch((fetchError) => {
        setStatementState({ isLoading: false, error: fetchError.message || "Unable to load statement.", statement: null });
      });
  }, []);

  useEffect(() => {
    loadCollection();
  }, [loadCollection]);

  useEffect(() => {
    if (!selectedStudentId) {
      setSelectedStudent(null);
      return;
    }

    getStudentProfile(selectedStudentId)
      .then((student) => setSelectedStudent(student))
      .catch(() => setSelectedStudent(null));
  }, [selectedStudentId]);

  const visibleCollectionItems = useMemo(() => {
    if (!selectedStudentId) {
      return collectionState.items;
    }

    return collectionState.items.filter((item) => recordBelongsToStudent(item, selectedStudentId, selectedStudent));
  }, [collectionState.items, selectedStudentId, selectedStudent]);

  const firstBalanceId = useMemo(() => {
    const selectedBalanceId = searchParams.get("balanceId");

    if (selectedBalanceId) {
      return selectedBalanceId;
    }

    const firstItem = visibleCollectionItems[0];
    return firstItem?.balance_id || firstItem?.balance?.id || firstItem?.id || null;
  }, [visibleCollectionItems, searchParams]);

  useEffect(() => {
    if (variant === "invoices") {
      loadStatement(firstBalanceId);
    }
  }, [firstBalanceId, loadStatement, variant]);

  return (
    <section className="data-panel data-panel-spaced">
      <div className="panel-header">
        <div>
          <h3>{variant === "payments" ? "Payments" : "Invoices"}</h3>
          <p>
            {selectedStudentId
              ? `Selected student's ${variant === "payments" ? "payment history" : "invoice information"} from the API.`
              : variant === "payments"
                ? "Payment history from the finance API."
                : "Invoices and balance statement information from the finance API."}
          </p>
        </div>
        <button className="panel-action" type="button" onClick={loadCollection} disabled={collectionState.isLoading}>
          {collectionState.isLoading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {collectionState.isLoading ? <p className="panel-note">Loading finance records...</p> : null}
      {!collectionState.isLoading && collectionState.error ? <p className="panel-note panel-note-error">{collectionState.error}</p> : null}
      {!collectionState.isLoading && !collectionState.error && !visibleCollectionItems.length ? (
        <p className="panel-note">No finance records were returned by the API.</p>
      ) : null}

      {!collectionState.isLoading && visibleCollectionItems.length ? (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{variant === "payments" ? "Payer" : "Invoice"}</th>
                <th>Reference</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visibleCollectionItems.slice(0, 8).map((item) => (
                <tr key={getRecordId(item) || getDisplayName(item)}>
                  <td>
                    <strong>{getDisplayName(item)}</strong>
                    <span>{item.student_name || item.student || item.balance_name || item.description || "-"}</span>
                  </td>
                  <td>{item.reference || item.invoice_number || item.payment_reference || item.receipt_number || "-"}</td>
                  <td>{item.date || item.created_at || item.issued_at || item.payment_date || "-"}</td>
                  <td>{item.amount || item.total || item.paid_amount || item.balance || "-"}</td>
                  <td>{item.status_display || item.status || item.payment_status || item.invoice_status || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {variant === "invoices" ? (
        <div className="statement-block">
          <div className="panel-header">
            <div>
              <h3>Balance Statement</h3>
              <p>{firstBalanceId ? `Statement for balance ${firstBalanceId}` : "Select a balance to view its statement."}</p>
            </div>
            {firstBalanceId ? (
              <button className="panel-action" type="button" onClick={() => loadStatement(firstBalanceId)} disabled={statementState.isLoading}>
                {statementState.isLoading ? "Loading..." : "Load statement"}
              </button>
            ) : null}
          </div>

          {statementState.isLoading ? <p className="panel-note">Loading statement...</p> : null}
          {!statementState.isLoading && statementState.error ? <p className="panel-note panel-note-error">{statementState.error}</p> : null}
          {!statementState.isLoading && statementState.statement ? (
            <div className="detail-grid">
              <div>
                <span>Balance</span>
                <strong>{statementState.statement.balance || statementState.statement.balance_name || firstBalanceId || "-"}</strong>
              </div>
              <div>
                <span>Opening Balance</span>
                <strong>{statementState.statement.opening_balance || statementState.statement.opening || "-"}</strong>
              </div>
              <div>
                <span>Total Debits</span>
                <strong>{statementState.statement.total_debits || statementState.statement.debits || "-"}</strong>
              </div>
              <div>
                <span>Total Credits</span>
                <strong>{statementState.statement.total_credits || statementState.statement.credits || "-"}</strong>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function recordBelongsToStudent(record, selectedStudentId, selectedStudent) {
  const possibleIds = [
    record?.student_id,
    record?.student?.id,
    record?.student,
    record?.balance?.student_id,
    record?.invoice?.student_id,
    getRecordId(selectedStudent),
  ]
    .filter(Boolean)
    .map(String);

  if (possibleIds.includes(String(selectedStudentId))) {
    return true;
  }

  const selectedName = getDisplayName(selectedStudent);
  const recordNames = [getDisplayName(record), record?.student_name, record?.balance_name].filter(Boolean);

  return Boolean(selectedName && selectedName !== "Unknown" && recordNames.includes(selectedName));
}

export default FinancePanel;
