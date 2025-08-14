const Donation = require('../models/Donation');
const Donor = require('../models/Donor');

exports.createDonor = async (req, res) => {
  try {
    const donor = await Donor.create(req.body);
    res.status(201).json(donor);
  } catch (error) {
    console.error('Create Donor Error:', error);
    res.status(500).json({ message: 'Failed to create donor', error });
  }
};

exports.updateDonor = async (req, res) => {
  try {
    const donor = await Donor.findByPk(req.params.id);
    if (!donor) return res.status(404).json({ message: 'Donor not found' });
    await donor.update(req.body);
    res.json(donor);
  } catch (error) {
    console.error('Update Donor Error:', error);
    res.status(500).json({ message: 'Failed to update donor', error });
  }
};


exports.getAllDonors = async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '', all } = req.query;
      const offset = (page - 1) * limit;
  
      const Sequelize = require('sequelize');
      const { Op } = Sequelize;


      let filters={
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { phone: { [Op.like]: `%${search}%` } },
        ],
      };
     
  
      let queryOptions = {
        where: {},
        include: [
          {
            model: Donation,
            as: 'donations',
          }
        ],
        order: [['createdAt', 'DESC']],
      };
  
      // Search filter
      if (search) {
       queryOptions.where = filters
      }
  
      if (all !== 'true') {
        queryOptions.offset = parseInt(offset);
        queryOptions.limit = parseInt(limit);
      }
  
      const donors = await Donor.findAndCountAll(queryOptions);

      let total=await Donor.count({where:filters});
  
      // Add totalAmount per donor and calculate total of all
      let totalDonationAmount = 0;
  
      const enrichedDonors = donors.rows.map(donor => {
        const donations = donor.donations || [];
        const totalAmount = donations.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);
        totalDonationAmount += totalAmount;
        return {
          ...donor.toJSON(),
          totalAmount,
        };
      });
  
      res.json({
        data: enrichedDonors,
        total,
        totalDonationAmount,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
      });
  
    } catch (error) {
      console.error('List All Donors Error:', error);
      res.status(500).json({ message: 'Failed to list donors', error });
    }
  };
  
exports.getDonorsList = async (req, res) => {
    try {
      const donors = await Donor.findAll();
      res.json(donors);
    } catch (error) {
      console.error('Get Donor Error:', error);
      res.status(500).json({ message: 'Failed to retrieve donor', error });
    }
};


exports.getDonor = async (req, res) => {
  try {
    const donor = await Donor.findByPk(req.params.id);
    if (!donor) return res.status(404).json({ message: 'Donor not found' });
    res.json(donor);
  } catch (error) {
    console.error('Get Donor Error:', error);
    res.status(500).json({ message: 'Failed to retrieve donor', error });
  }
};

exports.bulkDeleteDonors = async (req, res) => {
  try {
    const { ids } = req.body;
    const deleted = await Donor.destroy({ where: { id: ids } });
    res.json({ deleted });
  } catch (error) {
    console.error('Bulk Delete Donors Error:', error);
    res.status(500).json({ message: 'Failed to delete donors', error });
  }
};