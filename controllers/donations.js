// controllers/donationController.js
const Donation = require('../models/Donation');
const Donor = require('../models/Donor');

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

exports.listAllDonations = async (req, res) => {
  try {
    const { page = 1, limit = 10, campaign_id, all, h_n } = req.query;

    const whereClause = campaign_id ? { campaign_id } : {};
    const queryOptions = {
      where: whereClause,
      order: [['date', 'DESC']],
      include: [
        {
          model: Donor,
          as: 'donor',
        }
      ]
       // Changed from createdAt to date
    };

    if (all != "true") {
      queryOptions.offset = (page - 1) * limit;
      queryOptions.limit = parseInt(limit);
    }

    const donations = await Donation.findAndCountAll(queryOptions);

    const total = donations.count;

    const { sum } = await Donation.findOne({
      //where: whereClause,
      attributes: [[Donation.sequelize.fn('SUM', Donation.sequelize.col('amount')), 'sum']],
      raw: true
    });

    const formattedData = donations.rows.map(donation => {
      const data = donation.toJSON();
      if (h_n == 'true' && data.donor) {
         try{
          data.donor.name = formatDonorName(data.donor.name);
         }catch(e){
          
         }
      }
      return data;
    });

    res.json({
      total,
      totalAmount: parseFloat(sum) || 0,
      pages: all === "true" ? 1 : Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: formattedData
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
