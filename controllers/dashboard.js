// controllers/dashboardController.js
const { Op, fn, col } = require('sequelize');
const sequelize = require('../config/db');
const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');
const Donor = require('../models/Donor');
const Volunteer = require('../models/Volunteer');
const Newsletter = require('../models/NewsLetter');
const Event = require('../models/Event');

exports.getDashboardStats = async (req, res) => {
  try {
    // General counts
    const totalCampaigns = await Campaign.count();
    const totalDonations = await Donation.count();
    const totalEvents = await Event.count();
    const totalDonors = await Donor.count();
    const totalVolunteers = await Volunteer.count();
    const totalNewsletters = await Newsletter.count();

    // Get all campaigns with needed fields
    const campaigns = await Campaign.findAll({
      attributes: ['id', 'title_en', 'title_pt', 'insert_amount_raised_manually', 'raised']
    });

    const manualCampaigns = campaigns.filter(c => c.insert_amount_raised_manually);
    const manualRaised = manualCampaigns.reduce((sum, c) => sum + (c.raised || 0), 0);
    const manualCampaignIds = manualCampaigns.map(c => c.id);

    const donationRaised = await Donation.sum('amount', {
      where: {
        campaign_id: {
          [Op.notIn]: manualCampaignIds.length ? manualCampaignIds : [0]
        }
      }
    }) || 0;

    const totalRaised = manualRaised + donationRaised;

    // Pending volunteers
    const pendingVolunteers = await Volunteer.count({
      where: { status: 'pending' }
    });

    // Recent donations (last 5)
    const recentDonations = await Donation.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [
        { model: Donor, as: 'donor' },
        {
          model: Campaign,
          as: 'campaign',
          attributes: ['id', 'title_en', 'title_pt']
        }
      ]
    });

    // Get donation-based totals for non-manual campaigns
    const donationBasedCampaigns = await Donation.findAll({
      attributes: [
        'campaign_id',
        [fn('SUM', col('amount')), 'totalRaised']
      ],
      where: {
        campaign_id: {
          [Op.notIn]: manualCampaignIds.length ? manualCampaignIds : [0]
        }
      },
      group: ['campaign_id'],
      raw: true
    });

    // Map donation-based campaigns to consistent format
    const donationTopCampaigns = await Promise.all(donationBasedCampaigns.map(async (d) => {
      const campaign = campaigns.find(c => c.id === d.campaign_id);
      return {
        campaign_id: d.campaign_id,
        totalRaised: parseFloat(d.totalRaised),
        campaign: {
          id: campaign.id,
          title_en: campaign.title_en,
          title_pt: campaign.title_pt
        }
      };
    }));

    // Add manually raised campaigns
    const manualTopCampaigns = manualCampaigns.map(c => ({
      ...c,
      campaign_id: c.id,
      totalRaised: c.raised || 0,
      campaign: {
        id: c.id,
        title_en: c.title_en,
        title_pt: c.title_pt
      }
    }));

    // Merge, sort and limit top 3
    const topCampaigns = [...donationTopCampaigns, ...manualTopCampaigns]
      .sort((a, b) => b.totalRaised - a.totalRaised)
      .slice(0, 3);

    // Donation activity over last 7 days
    const recentDonationsStats = await Donation.findAll({
      attributes: [
        [fn('DATE', col('createdAt')), 'date'],
        [fn('COUNT', '*'), 'donationCount'],
        [fn('SUM', col('amount')), 'totalAmount']
      ],
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000)
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
