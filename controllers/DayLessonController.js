import Lesson from '../models/Lesson.js'
import Schedule from '../models/Schedule.js'

export const addDayLesson = async (req, res) => {
  try {
    const { _id, ...lesson } = req.body

    Schedule.findOneAndUpdate(
      {
        _id,
      },
      {
        $push: { exceptions: lesson },
      },
      (err, result) => {
        if (err) res.status(403).json(err)
        res.json(result)
      }
    )
  } catch (err) {
    res.status(404).json(err)
  }
}

export const changeDayLesson = async (req, res) => {
  const { _id, lessonId, date, time, teacher, name, type } = req.body
  try {
    let lesson = await Lesson.findOne({ _id: lessonId })
    if (!lesson) {
      // if not found in week Schedule search in exceptions
      let lesson = Schedule.findOne({ _id, exceptions: { _id: lessonId } })
      if (!lesson)
        res
          .status(404)
          .res.json({ message: "Couldn't find lesson with such id" })
      return lesson
    }

    lesson.time = time
    lesson.date = date
    lesson.teacher = teacher
    lesson.lesson = name
    lesson.type = type

    Schedule.findOneAndUpdate(
      { _id },
      {
        $pull: { exceptions: { _id: lessonId } },
      },
      (err, result) => {
        if (err) res.status(403).json(err)
        Schedule.findOneAndUpdate(
          { _id },
          { $push: { exceptions: lesson } },
          (err, result) => {
            if (err) res.status(403).json(err)
            res.json(result)
          }
        )
      }
    )
  } catch (error) {
    res.status(404).json(error)
  }
}

export const deleteDayLesson = async (req, res) => {
  const { _id, lessonId, date } = req.body
  try {
    let lesson = await Schedule.findOne({
      _id,
      exceptions: { _id: lessonId },
    })
    if (!lesson) {
      // if not found in week Schedule search in exceptions
      let lesson = await Lesson.findOne({ _id: lessonId })
      if (!lesson)
        res
          .status(404)
          .res.json({ message: "Couldn't find lesson with such id" })
      return lesson
    }
    lesson.time = undefined
    lesson.date = date

    Schedule.findOneAndUpdate(
      { _id },
      {
        $pull: { exceptions: { _id: lesson._id } },
      },
      (err, result) => {
        if (err) res.status(403).json(err)
        Schedule.findOneAndUpdate(
          { _id },
          { $push: { exceptions: lesson } },
          (err, result) => {
            if (err) res.status(403).json(err)
            res.json(result)
          }
        )
      }
    )
  } catch (error) {
    res.status(404).json(error)
  }
}
