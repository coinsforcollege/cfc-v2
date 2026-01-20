import TaskCategory from '../models/TaskCategory.js';

export const createCategory = async (req, res) => {
  try {
    const { name, scholarshipPoints, parent } = req.body;

    const category = new TaskCategory({
      name,
      scholarshipPoints: scholarshipPoints || 0,
      parent: parent || null
    });

    await category.save();

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(val => val.message).join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    // Fetch all categories and populate parent to build hierarchy if needed by frontend
    // Alternatively, we can build a tree structure here
    const categories = await TaskCategory.find()
      .populate('parent', 'name')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, scholarshipPoints, parent } = req.body;
    const category = await TaskCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    if (name) category.name = name;
    if (scholarshipPoints !== undefined) category.scholarshipPoints = scholarshipPoints;
    
    // Check for circular dependency if updating parent
    if (parent) {
      if (parent === category._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Category cannot be its own parent'
        });
      }
      category.parent = parent;
    } else if (parent === null) {
      category.parent = null;
    }

    await category.save();

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(val => val.message).join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await TaskCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Optional: Check if used in tasks or has children
    // keeping it simple for now as requested
    await category.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
