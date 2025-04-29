// controllers/campaignController.js
const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');
const { Op } = require('sequelize');

exports.createCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.create(req.body);
    res.status(201).json(campaign);
  } catch (error) {
    console.error('Create Campaign Error:', error);
    res.status(500).json({ message: 'Failed to create campaign', error });
  }
};

exports.updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findByPk(id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    await campaign.update(req.body);
    res.json(campaign);
  } catch (error) {
    console.error('Update Campaign Error:', error);
    res.status(500).json({ message: 'Failed to update campaign', error });
  }
};


exports.bulkDeleteCampaigns = async (req, res) => {
    try {
      const { ids } = req.body; 
  
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'No IDs provided for deletion' });
      }
  
      const deleted = await Campaign.destroy({
        where: { id: ids }
      });
  
      res.json({ message: `${deleted} campaigns deleted successfully` });
    } catch (error) {
      console.error('Bulk Delete Campaigns Error:', error);
      res.status(500).json({ message: 'Failed to delete campaigns', error });
    }
};
  


exports.listAllCampaigns = async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '', all} = req.query;
  
      const whereClause = search ? {
        [Op.or]: [
          { title_pt: { [Op.like]: `%${search}%` } },
          { title_en: { [Op.like]: `%${search}%` } },
          { location: { [Op.like]: `%${search}%` } }
        ]
      } : {};


      let queryOptions={
          where: whereClause,
          order: [['createdAt', 'DESC']],
          include: [
            {
              model: Donation,
              as: 'donations',
            }
          ]
      }
      
      if(all=="true"){
         queryOptions.offset=(page - 1) * limit
         queryOptions.limit=parseInt(limit)
      }
      
      const campaigns = await Campaign.findAndCountAll(queryOptions);

      let total=await Campaign.count({where:whereClause})

      res.json({
        total,
        pages: Math.ceil(campaigns.count / limit),
        currentPage: parseInt(page),
        data: campaigns.rows
      });

    } catch (error) {
      console.error('List Campaigns Error:', error);
      res.status(500).json({ message: 'Failed to list campaigns', error });
    }
  };

  exports.getCampaign = async (req, res) => {
    try {
      const { id } = req.params;
      const campaign = await Campaign.findByPk(id, {
        include: [
          { model: Donation, as: 'donations' }
        ]
      });
  
      if (!campaign) {
        return res.status(404).json({ message: 'Campaign not found' });
      }
  
      res.json(campaign);
    } catch (error) {
      console.error('Get Campaign Error:', error);
      res.status(500).json({ message: 'Failed to get campaign', error });
    }
  };
