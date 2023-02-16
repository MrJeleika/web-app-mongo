import mongoose from 'mongoose'

const LessonSchema = new mongoose.Schema({
  time: { type: String, required: true },
  lesson: { type: String, required: true },
  teacher: { type: String, required: true },
  group: { type: Number, required: true },
  date: { type: String, default: undefined },
  type: {
    type: String,
    required: true,
  },
})

export default mongoose.model('Lesson', LessonSchema)
