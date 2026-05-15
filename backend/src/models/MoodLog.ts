import mongoose, { Document, Schema } from 'mongoose';

export type MoodScore = 1 | 2 | 3 | 4 | 5;

export interface IMoodLog extends Document {
  userId: mongoose.Types.ObjectId;
  score: MoodScore;
  note: string;
  tags: string[];
  createdAt: Date;
}

const MoodLogSchema = new Schema<IMoodLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true, min: 1, max: 5 },
    note: { type: String, default: '', maxlength: 500 },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

MoodLogSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IMoodLog>('MoodLog', MoodLogSchema);
