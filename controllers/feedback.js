// controllers/feedbackController.js
const Feedback = require('../models/Feedback');

exports.createFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.create(req.body);
    res.status(201).json(feedback);
  } catch (error) {
    console.error('Create Feedback Error:', error);
    res.status(500).json({ message: 'Failed to create feedback', error });
  }
};

exports.updateFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByPk(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    await feedback.update(req.body);
    res.json(feedback);
  } catch (error) {
    console.error('Update Feedback Error:', error);
    res.status(500).json({ message: 'Failed to update feedback', error });
  }
};

exports.getAllFeedbacks = async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '', all } = req.query;
      const offset = (page - 1) * limit;
  
      let queryOptions = {
        where: {},
        order: [['createdAt', 'DESC']],
      };
  
      if (all === "true") {
        queryOptions.offset = parseInt(offset);
        queryOptions.limit = parseInt(limit);
      }
  
      const feedbacks = await Feedback.findAndCountAll(queryOptions);
      const total = await Feedback.count();
  
      res.json({
        data: feedbacks.rows,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      console.error('Get All Feedbacks Error:', error);
      res.status(500).json({ message: 'Failed to retrieve feedbacks', error });
    }
  };
  

exports.getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByPk(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    res.json(feedback);
  } catch (error) {
    console.error('Get Feedback Error:', error);
    res.status(500).json({ message: 'Failed to retrieve feedback', error });
  }
};

exports.bulkDeleteFeedbacks = async (req, res) => {
  try {
    const { ids } = req.body;
    const deleted = await Feedback.destroy({ where: { id: ids } });
    res.json({ deleted });
  } catch (error) {
    console.error('Bulk Delete Feedbacks Error:', error);
    res.status(500).json({ message: 'Failed to delete feedbacks', error });
  }
};