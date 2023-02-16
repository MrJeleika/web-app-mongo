import Lesson from '../models/Lesson.js'
import Schedule from '../models/Schedule.js'

export const addWeekLesson = async (req, res) => {
  try {
    const { _id, ...lesson } = req.body
    const doc = new Lesson(lesson)

    doc.save()
    Schedule.findOneAndUpdate(
      {
        _id,
      },
      {
        $push: { schedule: { _id: doc._id } },
      },
      (err, result) => {
        if (err) res.status(403).json(err)
        res.json(result)
      }
    )
  } catch (error) {
    if (!doc) {
      res.status(404).res.json({
        message: "Couldn't create a new Lesson",
      })
    }
  }
}

export const deleteWeekLesson = async (req, res) => {
  try {
    const { _id } = req.body
    Lesson.findOneAndDelete({ _id }, (err, result) => {
      if (err) res.status(403).json(err)
      res.json(result)
    }).populate('schedule')
  } catch (error) {
    res.status(404).res.json({
      message: "Couldn't delete Lesson",
    })
  }
}
