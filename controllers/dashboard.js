// controllers/dashboardController.js
const { Op, fn, col } = require('sequelize');
const sequelize = require('../config/db');
const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');
const Donor = require('../models/Donor');
const Volunteer = require('../models/Volunteer');
const Newsletter = require('../models/NewsLetter');
const Event = require('../models/Event'); // Assuming you have this model correctly defined

exports.getDashboardStats = async (req, res) => {
  try {
    // General counts
    const totalCampaigns = await Campaign.count();
    const totalDonations = await Donation.count();
    const totalEvents = await Event.count();
    const totalRaised = await Donation.sum('amount') || 0;
    const totalDonors = await Donor.count();
    const totalVolunteers = await Volunteer.count();
    const totalNewsletters = await Newsletter.count();

    // Pending volunteers
    const pendingVolunteers = await Volunteer.count({
      where: { status: 'pending' }
    });

    // Recent donations (last 5)
    const recentDonations = await Donation.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [
        
        {
          model: Donor,
          as: 'donor',
        },
        {
        model: Campaign,
        as: 'campaign',
        attributes: ['id', 'title_en', 'title_pt']
      }]
    });

    // Top campaigns by donation amount
    const topCampaigns = await Donation.findAll({
      attributes: [
        'campaign_id',
        [fn('SUM', col('amount')), 'totalRaised']
      ],
      include: [{
        model: Campaign,
        as: 'campaign',
        attributes: ['id', 'title_en', 'title_pt']
      }],
      group: ['campaign_id', 'campaign.id'],
      order: [[fn('SUM', col('amount')), 'DESC']],
      limit: 3
    });

    // Donation activity over last 7 days
    const recentDonationsStats = await Donation.findAll({
      attributes: [
        [fn('DATE', col('createdAt')), 'date'],
        [fn('COUNT', '*'), 'donationCount'],
        [fn('SUM', col('amount')), 'totalAmount']
      ],
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      },
      group: [fn('DATE', col('createdAt'))],
      order: [[fn('DATE', col('createdAt')), 'ASC']]
    });

    res.json({
      stats: {
        campaigns: totalCampaigns,
        donations: totalDonations,
        events: totalEvents,
        totalRaised,
        donors: totalDonors,
        volunteers: totalVolunteers,
        newsletterSubscribers: totalNewsletters,
        pendingVolunteers
      },
      topCampaigns,
      recentDonations,
      recentDonationsStats
    });

  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(500).json({ message: 'Failed to load dashboard stats', error });
  }
};
