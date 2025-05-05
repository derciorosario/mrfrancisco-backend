// controllers/eventController.js
const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    console.error('Create Event Error:', error);
    res.status(500).json({ message: 'Failed to create event', error });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.update(req.body);
    res.json(event);
  } catch (error) {
    console.error('Update Event Error:', error);
    res.status(500).json({ message: 'Failed to update event', error });
  }
};

exports.bulkDeleteEvents = async (req, res) => {
  try {
    const { ids } = req.body; // expects { ids: [1,2,3] }
    const deleted = await Event.destroy({ where: { id: ids } });
    res.json({ deleted });
  } catch (error) {
    console.error('Bulk Delete Events Error:', error);
    res.status(500).json({ message: 'Failed to delete events', error });
  }
};

exports.listAllEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '',all} = req.query;
    const offset = (page - 1) * limit;


    let queryOptions={
      where: {},
      order: [['date', 'DESC']]
    }

    if(all!="true"){
      queryOptions.offset=parseInt(offset)
      queryOptions.limit=parseInt(limit)
    }

    const events = await Event.findAndCountAll(queryOptions);

     let total=await Event.count()

    res.json({
      data: events.rows,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(events.count / limit)
    });
  } catch (error) {
    console.error('List All Events Error:', error);
    res.status(500).json({ message: 'Failed to list events', error });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Get Event Error:', error);
    res.status(500).json({ message: 'Failed to get event', error });
  }
};
