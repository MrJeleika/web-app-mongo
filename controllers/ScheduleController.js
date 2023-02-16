import Schedule from '../models/Schedule.js'

export const addWeekSchedule = async (req, res) => {
  try {
    const { week, day } = req.body

    const doc = new Schedule({
      week,
      day,
      schedule: [],
      exceptions: [],
    })
    if (!doc)
      res.status(403).json({
        message: 'Cannot create Schedule',
      })
    doc.save()
    res.json(doc)
  } catch (err) {
    res.status(404).json(err)
  }
}
