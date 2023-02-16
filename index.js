import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

import Lesson from './models/Lesson.js'
import Schedule from './models/Schedule.js'
import * as DayLesson from './controllers/DayLessonController.js'
import * as WeekLesson from './controllers/WeekLessonController.js'
import * as DaySchedule from './controllers/ScheduleController.js'

mongoose
  .connect(
    `mongodb+srv://MrJeleika:${process.env.PASSWORD}@cluster0.nvnsblz.mongodb.net/schedule?retryWrites=true&w=majority`
  )
  .then(() => console.log('ok'))
  .catch((e) => console.log(e))

const app = express()
app.use(express.json())
app.use(cors())

app.get('/schedule', async (req, res) => {
  Schedule.findOne(req.query)
    .populate('schedule')
    .exec((err, schedule) => {
      if (err) res.json(err)
      res.json(schedule)
    })
})

app.get('/schedules', async (req, res) => {
  Schedule.find()
    .populate('schedule')
    .sort({
      day: 1,
      week: 1,
    })
    .exec((err, schedule) => {
      if (err) res.json(err)
      res.json(schedule)
    })
})

app.post('/weekLesson', WeekLesson.addWeekLesson)
app.delete('/weekLesson', WeekLesson.deleteWeekLesson)

app.delete('/dayLesson', DayLesson.deleteDayLesson)
app.patch('/dayLesson', DayLesson.changeDayLesson)
app.post('/dayLesson', DayLesson.addDayLesson)

app.post('/schedule', DaySchedule.addWeekSchedule)

app.get('/lesson', async (req, res) => {
  try {
    const lesson = await Lesson.find(
      req.query,
      {},
      {
        sort: {
          day: 1,
        },
      }
    )

    res.json(lesson)
  } catch (e) {
    res.status(404).json({
      error: e.message,
    })
  }
})

app.get('/lessons', async (req, res) => {
  try {
    const lessons = await Lesson.find()

    res.json(lessons)
  } catch (e) {
    res.status(404).json({
      error: e.message,
    })
  }
})

app.patch('/lessons', async (req, res) => {
  try {
    Lesson.findOneAndUpdate(
      { _id: req.body.id },
      req.body,
      {
        returnDocument: 'after',
      },
      (err, doc) => {
        if (!doc)
          res.status(403).json({
            message: 'No lesson found',
          })
        res.json(doc)
      }
    )
  } catch (error) {
    res.status(404).json({
      error: error.message,
    })
  }
})

app.listen(process.env.PORT || 3001, (err) => {
  if (err) {
    return console.log(err)
  }
  console.log('Server started')
})
