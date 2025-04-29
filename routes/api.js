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

router.get('/images', async (req, res) => {
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




router.post('/campaign', createCampaign);
router.post('/campaign/:id', updateCampaign);
router.post('/campaigns/delete', bulkDeleteCampaigns); 
router.get('/campaigns/', listAllCampaigns);
router.get('/campaign/:id', getCampaign);

router.post('/event', createEvent);
router.post('/event/:id', updateEvent);
router.post('/events/delete', bulkDeleteEvents);
router.get('/events', listAllEvents);
router.get('/event/:id', getEvent);

router.get('/dashboard', getDashboardStats)

router.post('/donation', createDonation);
router.post('/donation/:id', updateDonation);
router.post('/donations/delete', bulkDeleteDonations);
router.get('/donations', listAllDonations);
router.get('/donation/:id', getDonation);

router.get('/user', authenticateToken, getUserData);

module.exports = router;  