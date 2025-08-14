const { Op } = require("sequelize");
const Homily = require("../models/Homily");


exports.getAllHomilies = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    const whereCondition = {};
    if (search) {
      whereCondition[Op.or] = [
        { title_pt: { [Op.like]: `%${search}%` } },
        { title_en: { [Op.like]: `%${search}%` } },
        { description_pt: { [Op.like]: `%${search}%` } },
        { description_en: { [Op.like]: `%${search}%` } }
      ];
    }


    const { count, rows } = await Homily.findAndCountAll({
      where: whereCondition,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['display_date', 'DESC']]
    });

    res.json({
      data: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error('Error fetching homilies:', error);
    res.status(500).json({ message: 'Failed to fetch homilies', error });
  }
};

exports.getHomilyById = async (req, res) => {
  try {
    const homily = await Homily.findByPk(req.params.id);
    if (!homily) {
      return res.status(404).json({ message: 'Homily not found' });
    }
    res.json(homily);
  } catch (error) {
    console.error('Error fetching homily:', error);
    res.status(500).json({ message: 'Failed to fetch homily', error });
  }
};

exports.createHomily = async (req, res) => {
  try {
    const { title_pt, title_en, description_pt, description_en, display_date,youtube_link } = req.body;
    
    const homily = await Homily.create({
      title_pt,
      title_en,
      description_pt,
      description_en,
      youtube_link,
      display_date: display_date || new Date()
    });

    res.status(201).json(homily);
  } catch (error) {
    console.error('Error creating homily:', error);
    res.status(400).json({ message: 'Failed to create homily', error });
  }
};

exports.updateHomily = async (req, res) => {
  try {
    const { title_pt, title_en, description_pt, description_en, display_date ,youtube_link} = req.body;
    
    const [updated] = await Homily.update({
      title_pt,
      title_en,
      description_pt,
      description_en,
      youtube_link,
      display_date
    }, {
      where: { id: req.params.id }
    });

    if (!updated) {
      return res.status(404).json({ message: 'Homily not found' });
    }

    const updatedHomily = await Homily.findByPk(req.params.id);
    res.json(updatedHomily);
  } catch (error) {
    console.error('Error updating homily:', error);
    res.status(400).json({ message: 'Failed to update homily', error });
  }
};

exports.deleteHomily = async (req, res) => {
  try {
    const deleted = await Homily.destroy({
      where: { id: req.params.id }
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Homily not found' });
    }

    res.json({ message: 'Homily deleted successfully' });
  } catch (error) {
    console.error('Error deleting homily:', error);
    res.status(500).json({ message: 'Failed to delete homily', error });
  }
};