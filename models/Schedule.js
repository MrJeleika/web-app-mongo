import mongoose from 'mongoose'

const ScheduleSchema = new mongoose.Schema({
  week: {
    type: Number,
    required: true,
  },
  day: {
    type: Number,
    required: true,
  },
  schedule: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
    },
  ],
  exceptions: [
    {
      time: {
        type: String,
        default: undefined,
      },
      lesson: {
        type: String,
        required: true,
      },
      teacher: {
        type: String,
        required: true,
      },
      group: {
        type: Number,
        required: true,
      },
      date: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
    },
  ],
})

export default mongoose.model('Schedule', ScheduleSchema)
