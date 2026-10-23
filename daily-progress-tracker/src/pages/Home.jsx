
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const API_URL = 'http://localhost:8080/api'

function Home() {
  const [streak, setStreak] = useState(null)
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)
        setError('')

        const [streakResponse, entriesResponse] = await Promise.all([
          fetch(`${API_URL}/streak`),
          fetch(`${API_URL}/entries`),
        ])

        if (!streakResponse.ok || !entriesResponse.ok) {
          throw new Error('Could not load dashboard data.')
        }

        const [streakData, entriesData] = await Promise.all([
          streakResponse.json(),
          entriesResponse.json(),
        ])

        setStreak(streakData.currentStreak)
        setEntries(entriesData)
      } catch (err) {
        setError(err.message || 'Something went wrong.')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const today = new Date()
  const year = today.getFullYear()
  const startDate = new Date(year, 0, 1)
  const endDate = new Date(year, 11, 31)

  const workedDates = new Set(
    entries
      .filter(
        (entry) =>
          entry.status === 'Completed' ||
          entry.status === 'In Progress'
      )
      .map((entry) => entry.entryDate)
  )

  
  
  const calendarWeeks = []
  const firstWeekday = (startDate.getDay() + 6) % 7

  let currentWeek = Array(firstWeekday).fill(null)

  for (
    let date = new Date(startDate);
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    const dateString = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('-')

    currentWeek.push({
      date: dateString,
      day: date.getDate(),
      month: date.getMonth(),
      worked: workedDates.has(dateString),
    })

    if (currentWeek.length === 7) {
      calendarWeeks.push(currentWeek)
      currentWeek = []
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null)
    }
    calendarWeeks.push(currentWeek)
  }

  const monthLabels = Array.from({ length: 12 }, (_, month) => {
    const firstOfMonth = new Date(year, month, 1)
    const dayOffset =
      Math.floor(
        (Date.UTC(year, month, 1) - Date.UTC(year, 0, 1)) /
          86400000
      ) + firstWeekday

    return {
      name: firstOfMonth.toLocaleString('en', { month: 'short' }),
      weekIndex: Math.floor(dayOffset / 7),
    }
  })

  const workedDayCount = workedDates.size
  const completedCount = entries.filter(
    (entry) => entry.status === 'Completed'
  ).length

  return (
    <div className="home-page">
      <div className="dashboard-heading">
        <div>
          <p className="eyebrow">YOUR CONSISTENCY, AT A GLANCE</p>
          <h1>Your Learning Streak</h1>
        </div>

        <Link to="/log-activity" className="primary-button">
          + Log Activity
        </Link>
      </div>

      {error && <p className="error-message" role="alert">{error}</p>}

      <div className="dashboard-stats">
        <section className="streak-card">
          <div className="streak-fire">🔥</div>
          <p className="stat-label">CURRENT STREAK</p>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <h2>{streak} <span>{streak === 1 ? 'day' : 'days'}</span></h2>
          )}

          <p className="streak-caption">Keep the fire alive!</p>
        </section>

        <section className="stat-card">
          <p className="stat-label">TOTAL ACTIVITIES</p>
          <h2>{loading ? '—' : entries.length}</h2>
          <p className="stat-caption">All recorded entries</p>
        </section>

        <section className="stat-card">
          <p className="stat-label">COMPLETED</p>
          <h2>{loading ? '—' : completedCount}</h2>
          <p className="stat-caption">Completed activities</p>
        </section>
      </div>

      <section className="heatmap-card">
        <div className="heatmap-heading">
          <div>
            <h2>Activity Heatmap</h2>
            <p>Your learning activity in {year}</p>
          </div>

          <div className="heatmap-legend">
            <span>Inactive</span>
            <span className="legend-square inactive-square" />
            <span>Worked</span>
            <span className="legend-square worked-square" />
          </div>
        </div>

        {loading ? (
          <p>Loading activity calendar...</p>
        ) : (
          <>
            

<div className="heatmap-timeline">
  <div className="heatmap-months">
    {monthLabels.map((month) => (
      <span
        key={month.name}
        style={{ gridColumnStart: month.weekIndex + 1 }}
      >
        {month.name}
      </span>
    ))}
  </div>

  <div
    className="heatmap-grid"
    role="group"
    aria-label={`Activity heatmap for ${year}`}
  >
    {calendarWeeks.map((week, weekIndex) => (
      <div className="heatmap-week" key={weekIndex}>
        {week.map((day, dayIndex) =>
          day ? (
            <div
              key={day.date}
              className={`heatmap-day ${
                day.worked ? 'worked' : 'inactive'
              }`}
              title={`${day.date}: ${
                day.worked
                  ? 'Activity recorded'
                  : 'No qualifying activity'
              }`}
              aria-label={`${day.date}: ${
                day.worked ? 'Worked' : 'Inactive'
              }`}
            />
          ) : (
            <div
              className="heatmap-day-placeholder"
              key={`blank-${weekIndex}-${dayIndex}`}
            />
          )
        )}
      </div>
    ))}
  </div>
</div>

            <div className="heatmap-summary">
              <span>{workedDayCount} active calendar days</span>
              <span>{year}</span>
            </div>
          </>
        )}
      </section>

      <div className="dashboard-footer">
        <span>Small steps. Consistent progress.</span>
        <Link to="/records">View activity records →</Link>
      </div>
    </div>
  )
}

export default Home
