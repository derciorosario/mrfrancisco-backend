// controllers/donationController.js
const Donation = require('../models/Donation');

exports.createDonation = async (req, res) => {
  try {
    const donation = await Donation.create(req.body);
    res.status(201).json(donation);
  } catch (error) {
    console.error('Create Donation Error:', error);
    res.status(500).json({ message: 'Failed to create donation', error });
  }
};

exports.updateDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const donation = await Donation.findByPk(id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    await donation.update(req.body);
    res.json(donation);
  } catch (error) {
    console.error('Update Donation Error:', error);
    res.status(500).json({ message: 'Failed to update donation', error });
  }
};

exports.bulkDeleteDonations = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No IDs provided for deletion' });
    }

    const deleted = await Donation.destroy({
      where: { id: ids }
    });

    res.json({ message: `${deleted} donations deleted successfully` });
  } catch (error) {
    console.error('Bulk Delete Donations Error:', error);
    res.status(500).json({ message: 'Failed to delete donations', error });
  }
};

exports.listAllDonations = async (req, res) => {
  try {
    const { page = 1, limit = 10, campaign_id,all } = req.query;

    const whereClause = campaign_id ? { campaign_id } : {};


    let queryOptions={
      where: whereClause,
      order: [['createdAt', 'DESC']]
    }

    if(all=="true"){
      queryOptions.offset=(page - 1) * limit
      queryOptions.limit=parseInt(limit)
    }

    const donations = await Donation.findAndCountAll(queryOptions);
    
    let total=await Donation.count({where:whereClause})

    res.json({
      total,
      pages: Math.ceil(donations.count / limit),
      currentPage: parseInt(page),
      data: donations.rows
    });
  } catch (error) {
    console.error('List Donations Error:', error);
    res.status(500).json({ message: 'Failed to list donations', error });
  }
};

exports.getDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const donation = await Donation.findByPk(id);

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    res.json(donation);
  } catch (error) {
    console.error('Get Donation Error:', error);
    res.status(500).json({ message: 'Failed to get donation', error });
  }
};
