// controllers/dashboardController.js
const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');
const Event = require('../models/Event');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalCampaigns = await Campaign.count();
    const totalDonations = await Donation.count();
    const totalEvents = await Event.count();
    const totalRaised = await Donation.sum('amount') || 0;

    // Get recent donations (last 5) and include their Campaign
    const recentDonations = await Donation.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{
        model: Campaign,
        as:'campaign',
        attributes: ['id', 'title_en', 'title_pt']
      }]
    });

    res.json({
      stats: {
        campaigns: totalCampaigns,
        donations: totalDonations,
        events: totalEvents,
        totalRaised
      },
      recentDonations
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(500).json({ message: 'Failed to load dashboard stats', error });
  }
};
