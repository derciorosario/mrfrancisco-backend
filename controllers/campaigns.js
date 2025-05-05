// controllers/campaignController.js
const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');
const { Op } = require('sequelize');
const Donor = require('../models/Donor');

function formatDonorName(fullName) {
  if (!fullName) return '';
  const nameParts = fullName.trim().split(' ');
  if (nameParts.length === 1) {
    const name = nameParts[0];
    const hidden = 'x'.repeat(Math.max(1, name.length - 1));
    return `${name[0]}${hidden}`;
  }
  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];
  const hiddenLastName = lastName[0] + 'x'.repeat(lastName.length - 1);
  return `${firstName} ${hiddenLastName}`;
}

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
      const { page = 1, limit = 10, search = '', all, h_n} = req.query;
  
      const whereClause = search ? {
        [Op.or]: [
          { title_pt: { [Op.like]: `%${search}%` } },
          { title_en: { [Op.like]: `%${search}%` } },
          { location: { [Op.like]: `%${search}%` } }
        ]
      } : {};


      let queryOptions={
          where: whereClause,
          order: [['date', 'DESC']],
          include: [
            {
              model: Donation,
              as: 'donations',
              include: [
                {
                  model: Donor,
                  as: 'donor',
                }
              ]
            }
          ]
      }
      
      if(all!="true"){
         queryOptions.offset=(page - 1) * limit
         queryOptions.limit=parseInt(limit)
      }

      const campaigns = await Campaign.findAndCountAll(queryOptions);

      let total=await Campaign.count({where:whereClause})



      const formattedData = campaigns.rows.map(c => {

        const data = c.toJSON();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const campaignDate = new Date(data.date); 
        campaignDate.setHours(0, 0, 0, 0);
        if (campaignDate.getTime() === today.getTime()) {
          data.status = 'occurring';
        } else if (campaignDate.getTime() < today.getTime()) {
          data.status = 'finished';
        } else {
          data.status = 'in-process';
        }

        if (h_n == 'true') {
            data.donations.map(donation=>{
              donation.donor.name = donation.donor.name ? formatDonorName(donation.donor.name) : donation.donor.name
              return donation
            })
        }

        return data;

      });

      res.json({
        total,
        pages: Math.ceil(campaigns.count / limit),
        currentPage: parseInt(page),
        data: formattedData
      });

    } catch (error) {
      console.error('List Campaigns Error:', error);
      res.status(500).json({ message: 'Failed to list campaigns', error });
    }
  };

  exports.getCampaign = async (req, res) => {
    try {
      const { id } = req.params;
      const {h_n} = req.query;
      let campaign = await Campaign.findByPk(id, {
        include: [
          { model: Donation, as: 'donations',include: [
            {
              model: Donor,
              as: 'donor',
            }
          ] }
        ]
      });

     
      if (h_n == 'true') {
          campaign=campaign.toJSON();
          campaign.donations=campaign.donations.map(donation=>{
            donation.name = donation.name ? formatDonorName(donation.name) : donation.name
            return donation
          })
      }
  
      if (!campaign) {
        return res.status(404).json({ message: 'Campaign not found' });
      }
  
      res.json(campaign);
    } catch (error) {
      console.error('Get Campaign Error:', error);
      res.status(500).json({ message: 'Failed to get campaign', error });
    }
  };
