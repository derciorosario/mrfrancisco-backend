const Contact = require('../models/Contact');

exports.createContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json(contact);
  } catch (error) {
    console.error('Create Contact Error:', error);
    res.status(500).json({ message: 'Failed to create contact', error });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    await contact.update(req.body);
    res.json(contact);
  } catch (error) {
    console.error('Update Contact Error:', error);
    res.status(500).json({ message: 'Failed to update contact', error });
  }
};


exports.getAllContacts = async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '', all } = req.query;
      const offset = (page - 1) * limit;
  
      let queryOptions = {
        where: {},
        order: [['createdAt', 'DESC']],
      };
  
      if (all === "true") {
        queryOptions.offset = parseInt(offset);
        queryOptions.limit = parseInt(limit);
      }
  
      const contacts = await Contact.findAndCountAll(queryOptions);
      const total = await Contact.count();
  
      res.json({
        data: contacts.rows,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(contacts.count / limit),
      });
    } catch (error) {
      console.error('Get All Contacts Error:', error);
      res.status(500).json({ message: 'Failed to retrieve contacts', error });
    }
  };
  

exports.getContact = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json(contact);
  } catch (error) {
    console.error('Get Contact Error:', error);
    res.status(500).json({ message: 'Failed to retrieve contact', error });
  }
};

exports.bulkDeleteContacts = async (req, res) => {
  try {
    const { ids } = req.body;
    const deleted = await Contact.destroy({ where: { id: ids } });
    res.json({ deleted });
  } catch (error) {
    console.error('Bulk Delete Contacts Error:', error);
    res.status(500).json({ message: 'Failed to delete contacts', error });
  }
};