import asyncHandler from 'express-async-handler';
import TravelStory from '../models/TravelStory.js';
import User from '../models/User.js';


const getTravelStories = asyncHandler(async (req, res) => {
    const { search } = req.query;
    const userId = req.user.id; 
    let query = { user: userId };

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { location: { $regex: search, $options: 'i' } }
        ];
    }

    const stories = await TravelStory.find(query).sort({ createdAt: -1 });

    const user = await User.findById(userId).select('favorites');
    const favoriteStoryIds = user ? user.favorites.map(favId => favId.toString()) : [];

    const storiesWithFavoriteStatus = stories.map(story => {
        const storyObject = story.toObject();
        return {
            ...storyObject,
            isFavorited: favoriteStoryIds.includes(storyObject._id.toString())
        };
    });

    res.status(200).json(storiesWithFavoriteStatus);
});


const addTravelStory = asyncHandler(async (req, res) => {
    const { title, date, image, description, location } = req.body;

    if (!title || !date || !image || !description || !location) {
        res.status(400);
        throw new Error('Please include all fields');
    }

    const newStory = await TravelStory.create({
        user: req.user.id, 
        title,
        date,
        image,
        description,
        location,
    });

    res.status(201).json(newStory);
});

const updateTravelStory = asyncHandler(async (req, res) => {
    const { title, date, image, description, location } = req.body;

    const story = await TravelStory.findById(req.params.id);

    if (!story) {
        res.status(404);
        throw new Error('Story not found');
    }

    if (story.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized to update this story');
    }

    story.title = title !== undefined ? title : story.title;
    story.date = date !== undefined ? date : story.date;
    story.image = image !== undefined ? image : story.image;
    story.description = description !== undefined ? description : story.description;
    story.location = location !== undefined ? location : story.location;

    const updatedStory = await story.save();
    res.status(200).json(updatedStory);
});

const deleteTravelStory = asyncHandler(async (req, res) => {
    const story = await TravelStory.findById(req.params.id);

    if (!story) {
        res.status(404);
        throw new Error('Story not found');
    }

    if (story.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized to delete this story');
    }

    await TravelStory.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Story removed successfully', id: req.params.id });
});

const toggleFavoriteStory = asyncHandler(async (req, res) => {
    const storyId = req.params.id;
    const userId = req.user.id; 

    const user = await User.findById(userId);
    const story = await TravelStory.findById(storyId); 

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    if (!story) {
        res.status(404);
        throw new Error('Travel Story not found');
    }

    const isFavorited = user.favorites.map(fav => fav.toString()).includes(storyId.toString());

    let action;
    if (isFavorited) {
        user.favorites = user.favorites.filter(fav => fav.toString() !== storyId.toString());
        action = 'unfavorited';
    } else {
        user.favorites.push(storyId);
        action = 'favorited';
    }

    await user.save();
    res.status(200).json({
        message: `Story ${action}`,
        favorites: user.favorites,
        action: action,
    });
});

export {
    getTravelStories,
    addTravelStory,
    updateTravelStory,
    deleteTravelStory,
    toggleFavoriteStory,
};