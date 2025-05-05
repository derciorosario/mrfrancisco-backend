const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path')
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'))
  },
  filename: function (req, file, cb) {
  	const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + " - "+file.originalname)
  }
})

const _upload = multer({ storage: storage, limits: { fileSize: 5000000 } });
const { upload } = require('../controllers/upload')
router.post('/upload',_upload.single('file'), upload);
const authenticateToken = require('../middleware/authenticateToken');
const { createCampaign, updateCampaign, bulkDeleteCampaigns, listAllCampaigns, getCampaign } = require('../controllers/campaigns');
const { createDonation, updateDonation, bulkDeleteDonations, listAllDonations, getDonation } = require('../controllers/donations');
const { getUserData } = require('../controllers/user');
const { createEvent, updateEvent, bulkDeleteEvents, listAllEvents, getEvent } = require('../controllers/events');
const { getDashboardStats } = require('../controllers/dashboard');
const GalleryImage = require('../models/GalleryImage');
const Category = require('../models/Category');
const { createPaymentMethod, updatePaymentMethod, bulkDeletePaymentMethods, getAllPaymentMethods, getPaymentMethod } = require('../controllers/payment_method');
const { createContact, updateContact, getAllContacts, getContact, bulkDeleteContacts } = require('../controllers/contacts');
const { createFeedback, updateFeedback, getAllFeedbacks, getFeedback, bulkDeleteFeedbacks } = require('../controllers/feedback');
const { createNewsletter, updateNewsletter, bulkDeleteNewsletters, getAllNewsletters, getNewsletter } = require('../controllers/newsletter');
const { getAllCategories, getCategory, bulkDeleteCategories, updateCategory, createCategory } = require('../controllers/gallery_category');
const { bulkDeleteDonors, createDonor, updateDonor, getAllDonors, getDonor, getDonorsList } = require('../controllers/donors');
const { createVolunteer, updateVolunteer, listAllVolunteers, getVolunteer, bulkDeleteVolunteers, joinAsVolunteer, updateVolunteerStatus } = require('../controllers/volunteer');

router.post('/upload-image', _upload.single('image'), async (req, res) => {
  try {
    const { categoryId } = req.body;
    const imageUrl = `${req.file.filename}`;

    const newImage = await GalleryImage.create({
      url: imageUrl,
      categoryId,
    });

    res.json({ url: imageUrl, id: newImage.id,categoryId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Image upload failed.' });
  }
});

router.get('/gallery', async (req, res) => {
  try {
    const images = await GalleryImage.findAll();
    res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to getting images.' });
  }
});

router.post('/add-category', async (req, res) => {
  try {
    const { name_pt,name_en } = req.body;
    const newCategory = await Category.create({ name_pt,name_en });
    res.json({ category: newCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add category.' });
  }
});


router.get('/delete-image/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const image = await GalleryImage.findByPk(id);

    if (!image) {
      return res.status(404).json({ message: 'Image not found.' });
    }

    const filePath = path.join(__dirname, '..', 'uploads', image.url);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    await image.destroy();
    return res.json({ message: 'Image deleted successfully.' });
  } catch (error) {
    console.error('Error deleting image:', error);
    return res.status(500).json({ message: 'Failed to delete image.' });
  }

});



router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to getting category.' });
  }
});


router.get('/categories/:id', async (req, res) => {
  
  const id = parseInt(req.params.id);

  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const relatedImages = await GalleryImage.findAll({ where: { categoryId: id } });

    // Delete image files
    for (const image of relatedImages) {
      const filePath = path.join(__dirname, '..', 'uploads', image.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await GalleryImage.destroy({ where: { categoryId: id } });

    await category.destroy();

    res.json({ message: 'Category and associated images deleted successfully' });

  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Server error' });
  }

});

router.post('/donor', createDonor);
router.post('/donor/:id', updateDonor);
router.get('/donors', getAllDonors);
router.get('/donors-list', getDonorsList);
router.get('/donor/:id', getDonor);
router.post('/donors/delete', bulkDeleteDonors);

router.post('/volunteer', createVolunteer);
router.post('/join-as-volunteer', joinAsVolunteer);
router.post('/volunteer/:id', updateVolunteer);
router.get('/volunteers', listAllVolunteers);
router.get('/home-volunteers', listAllVolunteers);
router.get('/volunteer/:id', getVolunteer);
router.post('/volunteers/delete', bulkDeleteVolunteers);
router.post('/volunteers/status',updateVolunteerStatus);



router.post('/gallery-category', createCategory);
router.post('/gallery-category/:id', updateCategory);
router.post('/gallery-categories/delete', bulkDeleteCategories);
router.get('/gallery-categories', getAllCategories);
router.get('/gallery-category/:id', getCategory);

router.post('/campaign', createCampaign);
router.post('/campaign/:id', updateCampaign);
router.post('/campaigns/delete', bulkDeleteCampaigns); 
router.get('/campaigns/', listAllCampaigns);
router.get('/home-campaigns/', listAllCampaigns);
router.get('/campaign/:id', getCampaign);

router.post('/event', createEvent);
router.post('/event/:id', updateEvent);
router.post('/events/delete', bulkDeleteEvents);
router.get('/events', listAllEvents);
router.get('/home-events', listAllEvents);
router.get('/event/:id', getEvent);

router.post('/contact', createContact);
router.post('/contact/:id', updateContact);
router.get('/contacts', getAllContacts);
router.get('/contact/:id', getContact);
router.post('/contacts/delete', bulkDeleteContacts);

router.post('/feedback', createFeedback);
router.post('/feedback/:id', updateFeedback);
router.get('/feedback', getAllFeedbacks);
router.get('/feedback/:id', getFeedback);
router.post('/feedbacks/delete', bulkDeleteFeedbacks);

router.post('/newsletter', createNewsletter);
router.post('/newsletter/:id', updateNewsletter);
router.post('/newsletters/delete', bulkDeleteNewsletters);
router.get('/newsletter', getAllNewsletters);
router.get('/newsletter/:id', getNewsletter);

router.get('/dashboard', getDashboardStats)

router.post('/donation', createDonation);
router.post('/donation/:id', updateDonation);
router.post('/donations/delete', bulkDeleteDonations);
router.get('/donations', listAllDonations);
router.get('/donation/:id', getDonation);

router.post('/payment-method', createPaymentMethod);
router.post('/payment-method/:id', updatePaymentMethod);
router.post('/payment-methods/delete', bulkDeletePaymentMethods);
router.get('/payment-methods', getAllPaymentMethods);
router.get('/payment-method/:id', getPaymentMethod);

router.get('/user', authenticateToken, getUserData);

module.exports = router;  