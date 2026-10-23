
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import './ActivityRecords.css'

const API_URL = 'http://localhost:8080/api/entries'

function ActivityRecords() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [editingEntry, setEditingEntry] = useState(null)
  const [savingEdit, setSavingEdit] = useState(false)

  async function fetchEntries() {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(API_URL)

      if (!response.ok) {
        throw new Error('Could not load activity records.')
      }

      const data = await response.json()
      setEntries(data)
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEntries()
  }, [])

  async function handleDelete(id) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this activity?'
    )

    if (!confirmed) return

    try {
      setDeletingId(id)
      setError('')

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Could not delete this activity.')
      }

      setEntries((previous) =>
        previous.filter((entry) => entry.id !== id)
      )
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setDeletingId(null)
    }
  }
  
  function handleEditChange(event) {
    const { name, value } = event.target

    setEditingEntry((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  async function handleSaveEdit(event) {
    event.preventDefault()
    if (!editingEntry) return

    try {
      setSavingEdit(true)
      setError('')

      const response = await fetch(
        `${API_URL}/${editingEntry.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: editingEntry.title,
            topic: editingEntry.topic,
            difficulty: editingEntry.difficulty,
            status: editingEntry.status,
            entryDate: editingEntry.entryDate,
            notes: editingEntry.notes || '',
          }),
        }
      )

      if (!response.ok) {
        const message = await response.text()
        throw new Error(message || 'Could not update the activity.')
      }

      await fetchEntries()
      setEditingEntry(null)
    } catch (err) {
      setError(err.message || 'Could not update the activity.')
    } finally {
      setSavingEdit(false)
    }
  }


  if (loading) {
    return (
      <section className="records-page">
        <h1>Activity Records</h1>
        <p className="records-muted">Loading your activities...</p>
      </section>
    )
  }

  return (
    <section className="records-page">
      <div className="records-heading">
        <div>
          <p className="eyebrow">YOUR LEARNING HISTORY</p>
          <h1>Activity Records</h1>
          <p className="records-muted">
            Review your progress, one activity at a time.
          </p>
        </div>

        <Link to="/log-activity" className="primary-button">
          + Log Activity
        </Link>
      </div>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      
{editingEntry && (
  <form className="activity-form" onSubmit={handleSaveEdit}>
    <h2>Edit Activity</h2>

    <div className="form-group">
      <label htmlFor="edit-title">Activity Title *</label>
      <input
        id="edit-title"
        name="title"
        value={editingEntry.title}
        onChange={handleEditChange}
        maxLength={100}
        required
      />
    </div>

    <div className="form-group">
      <label htmlFor="edit-topic">Topic *</label>
      <input
        id="edit-topic"
        name="topic"
        value={editingEntry.topic}
        onChange={handleEditChange}
        maxLength={50}
        required
      />
    </div>

    <div className="form-row">
      <div className="form-group">
        <label htmlFor="edit-difficulty">Difficulty *</label>
        <select
          id="edit-difficulty"
          name="difficulty"
          value={editingEntry.difficulty}
          onChange={handleEditChange}
          required
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
          <option value="N/A">N/A</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="edit-status">Status *</label>
        <select
          id="edit-status"
          name="status"
          value={editingEntry.status}
          onChange={handleEditChange}
          required
        >
          <option value="Completed">Completed</option>
          <option value="In Progress">In Progress</option>
          <option value="Skipped">Skipped</option>
        </select>
      </div>
    </div>

    <div className="form-group">
      <label htmlFor="edit-entryDate">Activity Date *</label>
      <input
        id="edit-entryDate"
        name="entryDate"
        type="date"
        value={editingEntry.entryDate}
        onChange={handleEditChange}
        required
      />
    </div>

    <div className="form-group">
      <label htmlFor="edit-notes">Notes</label>
      <textarea
        id="edit-notes"
        name="notes"
        value={editingEntry.notes || ''}
        onChange={handleEditChange}
        maxLength={500}
        rows={4}
      />
    </div>

    <div className="form-actions">
      <button
        type="button"
        className="secondary-button"
        onClick={() => setEditingEntry(null)}
        disabled={savingEdit}
      >
        Cancel
      </button>

      <button
        type="submit"
        className="primary-button"
        disabled={savingEdit}
      >
        {savingEdit ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  </form>
)}


      <div className="records-summary">
        <span>Total records</span>
        <strong>{entries.length}</strong>
      </div>

      {entries.length === 0 ? (
        <div className="records-empty">
          <h2>No activities yet</h2>
          <p>Your learning journey starts with one small step.</p>
          <Link to="/log-activity" className="primary-button">
            Log your first activity
          </Link>
        </div>
      ) : (
        <div className="records-table-wrapper">
          <table className="records-table">
            <thead>
              <tr>
                <th>Activity</th>
                <th>Topic</th>
                <th>Difficulty</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td>
                    <div className="record-title">{entry.title}</div>
                    {entry.notes && (
                      <div className="record-notes">
                        {entry.notes}
                      </div>
                    )}
                  </td>

                  <td>{entry.topic}</td>

                  <td>
                    <span
                      className={`difficulty-badge ${entry.difficulty
                        ?.toLowerCase()
                        .replace('/', '-')}`}
                    >
                      {entry.difficulty}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`status-badge ${entry.status
                        ?.toLowerCase()
                        .replace(/\s+/g, '-')}`}
                    >
                      {entry.status}
                    </span>
                  </td>

                  <td>{entry.entryDate}</td>

                  <td>
                    <div className="record-actions">
                        
<button
  type="button"
  className="edit-button"
  onClick={() =>
    setEditingEntry({
      ...entry,
    })
  }
>
  Edit
</button>

                      



                      <button
                        type="button"
                        className="delete-button"
                        disabled={deletingId === entry.id}
                        onClick={() => handleDelete(entry.id)}
                      >
                        {deletingId === entry.id
                          ? 'Deleting...'
                          : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default ActivityRecords
