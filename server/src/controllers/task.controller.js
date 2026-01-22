import Task from '../models/Task.js';
import fs from 'fs';
import path from 'path';

export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      categories,
      topic,
      grade,
      difficulty,
      activity,
      scholarshipPoints,
      requiresApproval,
      ctaLink,
      ctaLabel,
      status, // 'Draft', 'Active', 'Archived'
      expiryDate,
      thumbnail
    } = req.body;

    const files = req.files ? req.files.map(file => {
      // Determine type based on mimetype
      const type = file.mimetype.startsWith('image/') ? 'image' : 'document';
      // Path relative to public (or full url if served statically)
      // Assuming server serves 'public' at root or specific path
      // Constructing relative path to be stored
      let relativePath = '';
      if (type === 'image') {
        relativePath = `/images/content-library/${file.filename}`;
      } else {
        relativePath = `/documents/content-library/${file.filename}`;
      }
      return {
        url: relativePath,
        type: type,
        name: file.originalname
      };
    }) : [];

    // Check if a thumbnail URL was passed explicitly, otherwise use first uploaded image
    let taskThumbnail = thumbnail;
    if (!taskThumbnail) {
        const firstImage = files.find(f => f.type === 'image');
        if (firstImage) {
            taskThumbnail = firstImage.url;
        }
    }

    const task = new Task({
      title,
      description,
      categories: JSON.parse(categories), // Multipart sends arrays as strings
      topic: topic ? JSON.parse(topic) : [],
      grade: JSON.parse(grade),
      difficulty,
      activity,
      scholarshipPoints,
      requiresApproval: requiresApproval === 'true',
      ctaLink,
      ctaLabel,
      files,
      thumbnail: taskThumbnail,
      status: status || 'Draft',
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      createdBy: req.user._id
    });

    await task.save();

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateTask = async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }
  
      // Handle file uploads if any
      const newFiles = req.files ? req.files.map(file => {
        const type = file.mimetype.startsWith('image/') ? 'image' : 'document';
        let relativePath = '';
        if (type === 'image') {
          relativePath = `/images/content-library/${file.filename}`;
        } else {
          relativePath = `/documents/content-library/${file.filename}`;
        }
        return {
          url: relativePath,
          type: type,
          name: file.originalname
        };
      }) : [];
  
      // Merge new files with existing or replace? Usually append or replace specific.
      // For simplicity, let's append new files to existing ones unless specific logic needed.
      // But if user deleted files in UI, we'd need a separate validFiles list or something.
      // For now, let's just append.
      if (newFiles.length > 0) {
          task.files.push(...newFiles);
      }

      // Handle text fields
      const {
        title, description, categories, topic, grade, difficulty, activity,
        scholarshipPoints, requiresApproval, ctaLink, ctaLabel, status, expiryDate,
        thumbnail, existingFiles // JSON string of files to keep
      } = req.body;

      if (title) task.title = title;
      if (description) task.description = description;
      if (categories) task.categories = JSON.parse(categories);
      if (topic) task.topic = JSON.parse(topic);
      if (grade) task.grade = JSON.parse(grade);
      if (difficulty) task.difficulty = difficulty;
      if (activity) task.activity = activity;
      if (scholarshipPoints) task.scholarshipPoints = scholarshipPoints;
      if (requiresApproval !== undefined) task.requiresApproval = requiresApproval === 'true';
      if (ctaLink) task.ctaLink = ctaLink;
      if (ctaLabel) task.ctaLabel = ctaLabel;
      if (status) task.status = status;
      if (expiryDate) task.expiryDate = new Date(expiryDate);
      
      // Update files list if existingFiles is provided (for deletion support)
      if (existingFiles) {
          const keepFiles = JSON.parse(existingFiles); // Array of file objects that user kept
          // Filter task.files to only include those in keepFiles (by url or id if present)
          // We can just set task.files = keepFiles + newFiles
          task.files = [...keepFiles, ...newFiles];
      }

      // Thumbnail logic
      if (thumbnail) {
          task.thumbnail = thumbnail;
      } else if (!task.thumbnail && task.files.length > 0) {
          const firstImage = task.files.find(f => f.type === 'image');
          if (firstImage) task.thumbnail = firstImage.url;
      }
  
      await task.save();
  
      res.status(200).json({
        success: true,
        data: task
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

export const getAllTasks = async (req, res) => {
  try {
    const { status, category, grade, page = 1, limit = 10, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (category) query.categories = category; // assuming single category filter
    if (grade) query.grade = grade; // exact match or 'in' logic?
    if (search) {
        query.title = { $regex: search, $options: 'i' };
    }

    const tasks = await Task.find(query)
      .populate('categories', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(query);

    res.status(200).json({
      success: true,
      data: tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('categories');
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    await task.deleteOne();

    // Optional: Delete physical files
    // task.files.forEach(file => ...)

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const bulkDeleteTasks = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'No task IDs provided' });
    }

    const result = await Task.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} tasks deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const duplicateTask = async (req, res) => {
  try {
    const originalTask = await Task.findById(req.params.id);
    if (!originalTask) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Create a copy of the task with a new title
    const duplicatedTask = new Task({
      title: `${originalTask.title} (Copy)`,
      description: originalTask.description,
      categories: originalTask.categories,
      topic: originalTask.topic,
      grade: originalTask.grade,
      difficulty: originalTask.difficulty,
      activity: originalTask.activity,
      scholarshipPoints: originalTask.scholarshipPoints,
      requiresApproval: originalTask.requiresApproval,
      ctaLink: originalTask.ctaLink,
      ctaLabel: originalTask.ctaLabel,
      files: originalTask.files,
      thumbnail: originalTask.thumbnail,
      status: originalTask.status,
      expiryDate: originalTask.expiryDate,
      createdBy: req.user._id
    });

    await duplicatedTask.save();

    // Populate categories for response
    await duplicatedTask.populate('categories', 'name');

    res.status(201).json({
      success: true,
      data: duplicatedTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
