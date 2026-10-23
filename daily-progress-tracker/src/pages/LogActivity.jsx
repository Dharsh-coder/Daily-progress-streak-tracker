
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LogActivity.css'

const API_URL = 'http://localhost:8080/api/entries'

function LogActivity() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    topic: '',
    difficulty: 'Easy',
    status: 'Completed',
    entryDate: new Date().toLocaleDateString('en-CA'),
    notes: '',
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))

    setError('')
    setSuccess('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    try {
      setSaving(true)

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const message = await response.text()
        throw new Error(message || 'Could not save the activity.')
      }

      setSuccess('Activity saved successfully!')

      setTimeout(() => {
        navigate('/records')
      }, 800)
    } catch (err) {
      setError(
        err.message ||
          'Could not connect to the server. Check whether the backend is running.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="log-page">
      <div className="log-heading">
        <p className="eyebrow">MAKE EVERY DAY COUNT</p>
        <h1>Log Activity</h1>
        <p>Record what you studied and keep your progress moving.</p>
      </div>

      <form className="activity-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Activity Title *</label>
          <input
            id="title"
            name="title"
            type="text"
            maxLength={100}
            placeholder="e.g. Solved Two Sum on LeetCode"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="topic">Topic *</label>
          <input
            id="topic"
            name="topic"
            type="text"
            maxLength={50}
            placeholder="e.g. Arrays, Java, SQL"
            value={formData.topic}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="difficulty">Difficulty *</label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              required
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
              <option value="N/A">N/A</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Skipped">Skipped</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="entryDate">Activity Date *</label>
          <input
            id="entryDate"
            name="entryDate"
            type="date"
            value={formData.entryDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            maxLength={500}
            rows={4}
            placeholder="What did you learn? Any challenges?"
            value={formData.notes}
            onChange={handleChange}
          />
          <span className="field-hint">
            {formData.notes.length}/500 characters
          </span>
        </div>

        {error && (
          <p className="form-message error-message" role="alert">
            {error}
          </p>
        )}

        {success && (
          <p className="form-message success-message" role="status">
            {success}
          </p>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate('/')}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-button"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Activity'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default LogActivity
