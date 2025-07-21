import express from 'express';
const router = express.Router();
import {
    getTravelStories,
    addTravelStory,
    updateTravelStory,
    deleteTravelStory,
    toggleFavoriteStory, 
} from '../controllers/travelStoryController.js';
import { protect } from '../middleware/authMiddleware.js'; 

router.get('/', protect, getTravelStories); 

router.post('/', protect, addTravelStory);
router.put('/:id', protect, updateTravelStory);
router.delete('/:id', protect, deleteTravelStory);

router.post('/:id/favorite', protect, toggleFavoriteStory); 

export default router;