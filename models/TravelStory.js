import mongoose from 'mongoose';

const travelStorySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    date: { type: Date, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('TravelStory', travelStorySchema); 