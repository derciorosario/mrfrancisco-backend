const Newsletter = require("../models/NewsLetter");

exports.createNewsletter = async (req, res) => {
  try {

    if(await Newsletter.findOne({where:{email:req.body.email}})){
        res.status(409).json();
        return
    }
    const newsletter = await Newsletter.create(req.body);
    res.status(201).json(newsletter);
  } catch (error) {
    console.error('Create Newsletter Error:', error);
    res.status(500).json({ message: 'Failed to create newsletter', error });
  }
};

exports.updateNewsletter = async (req, res) => {
    try {
      const { id } = req.params;
      const { email } = req.body;
  
      const newsletter = await Newsletter.findByPk(id);
      if (!newsletter) {
        return res.status(404).json({ message: 'Newsletter not found' });
      }
  
      // If email is being updated, check for duplicates
      if (email && email !== newsletter.email) {
        const existing = await Newsletter.findOne({ where: { email } });
        if (existing) {
          return res.status(409).json({ message: 'Email already exists' });
        }
      }
  
      await newsletter.update(req.body);
      res.json(newsletter);
    } catch (error) {
      console.error('Update Newsletter Error:', error);
      res.status(500).json({ message: 'Failed to update newsletter', error });
    }
  };
  

exports.getAllNewsletters = async (req, res) => {
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
  
      const newsletters = await Newsletter.findAndCountAll(queryOptions);
      const total = await Newsletter.count();
  
      res.json({
        data: newsletters.rows,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      console.error('Get All Newsletters Error:', error);
      res.status(500).json({ message: 'Failed to retrieve newsletters', error });
    }
  };

  
exports.getNewsletter = async (req, res) => {
  try {
    const newsletter = await Newsletter.findByPk(req.params.id);
    if (!newsletter) return res.status(404).json({ message: 'Newsletter not found' });
    res.json(newsletter);
  } catch (error) {
    console.error('Get Newsletter Error:', error);
    res.status(500).json({ message: 'Failed to retrieve newsletter', error });
  }
};

exports.bulkDeleteNewsletters = async (req, res) => {
  try {
    const { ids } = req.body;
    const deleted = await Newsletter.destroy({ where: { id: ids } });
    res.json({ deleted });
  } catch (error) {
    console.error('Bulk Delete Newsletters Error:', error);
    res.status(500).json({ message: 'Failed to delete newsletters', error });
  }
};
