const { Op } = require('sequelize');
const Volunteer = require('../models/Volunteer');

exports.createVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.create(req.body);
    res.status(201).json(volunteer);
  } catch (error) {
    console.error('Create Volunteer Error:', error);
    res.status(500).json({ message: 'Failed to create volunteer', error });
  }
};

exports.joinAsVolunteer = async (req, res) => {
    try {
      const volunteer = await Volunteer.create(req.body);
      res.status(201).json(volunteer);
    } catch (error) {
      console.error('Create Volunteer Error:', error);
      res.status(500).json({ message: 'Failed to create volunteer', error });
    }
  };

exports.updateVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByPk(req.params.id);
    if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
    await volunteer.update(req.body);
    res.json(volunteer);
  } catch (error) {
    console.error('Update Volunteer Error:', error);
    res.status(500).json({ message: 'Failed to update volunteer', error });
  }
};

exports.listAllVolunteers = async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '', all,status } = req.query;
      const offset = (page - 1) * limit;
  
      let queryOptions = {
        where: {
            ...(status && { status: { [Op.in]: status.split(",") } }),
        },
        order: [['createdAt', 'DESC']],
      };
  
      if (search) {
        queryOptions.where = {
          ...queryOptions.search,
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { phone: { [Op.like]: `%${search}%` } },
          ],
        };
      }
  
      if (all !== 'true') {
        queryOptions.offset = parseInt(offset);
        queryOptions.limit = parseInt(limit);
      }
  
      const volunteers = await Volunteer.findAndCountAll(queryOptions);
      const total = await Volunteer.count();
  
      res.json({
        data: volunteers.rows,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(volunteers.count / limit),
      });
    } catch (error) {
      console.error('List All Volunteers Error:', error);
      res.status(500).json({ message: 'Failed to list volunteers', error });
    }
};

exports.getVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByPk(req.params.id);
    if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
    res.json(volunteer);
  } catch (error) {
    console.error('Get Volunteer Error:', error);
    res.status(500).json({ message: 'Failed to retrieve volunteer', error });
  }
};

exports.updateVolunteerStatus = async (req, res) => {
    try {
      const { status, id } = req.body; 
      if (!status) {
        return res.status(400).json({ error: 'status is required.' });
      }
  
      const volunteer = await Volunteer.findByPk(id);
      if (!volunteer) {
        return res.status(404).json({ error: 'Not found.' });
      }
  
      volunteer.status = status;
      await volunteer.save();
      return res.status(200).json({
        message: 'Approval status updated successfully.',
        volunteer,
      });
  
    } catch (error) {
      console.error('Error updating approval status:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
};

exports.bulkDeleteVolunteers = async (req, res) => {
  try {
    const { ids } = req.body;
    const deleted = await Volunteer.destroy({ where: { id: ids } });
    res.json({ deleted });
  } catch (error) {
    console.error('Bulk Delete Volunteers Error:', error);
    res.status(500).json({ message: 'Failed to delete volunteers', error });
  }
};
