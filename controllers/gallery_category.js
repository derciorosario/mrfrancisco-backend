const Category = require('../models/Category');
const GalleryImage = require('../models/GalleryImage');

exports.createCategory = async (req, res) => {
  try {

    if(await Category.findOne({where:{name_pt:req.body.name_pt}})){
        return res.status(409).json({ message: 'category already exists' });
    }
    const category = await Category.create(req.body);

    res.status(201).json(category);
  } catch (error) {
    console.error('Create Category Error:', error);
    res.status(500).json({ message: 'Failed to create category', error });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    await category.update(req.body);
    res.json(category);
  } catch (error) {
    console.error('Update Category Error:', error);
    res.status(500).json({ message: 'Failed to update category', error });
  }
};



exports.getAllCategories = async (req, res) => {
    try {
      const { page = 1, limit = 10, name_en, name_pt,all } = req.query;
      const offset = (page - 1) * limit;
  
      const where = {};
      if (name_en) where.name_en = { [require('sequelize').Op.like]: `%${name_en}%` };
      if (name_pt) where.name_pt = { [require('sequelize').Op.like]: `%${name_pt}%` };

      let whereClause=where

      let queryOptions={
        whereClause,
        include: { model: GalleryImage, as: 'images' },
        order: [['createdAt', 'DESC']],
      }

      if(all=="true"){
        queryOptions.limit=parseInt(limit)
        queryOptions.offset=parseInt(offset)
      }
     
      const { rows } = await Category.findAndCountAll(queryOptions);

      const total = await Category.count({ where: whereClause });
      res.json({
        total,
        page: parseInt(page),
        pageSize: parseInt(limit),
        pages:Math.ceil(total / limit),
        data: rows,
      });

    } catch (error) {
      console.error('Get All Categories Error:', error);
      res.status(500).json({ message: 'Failed to retrieve categories', error });
    }
};

  

exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: { model: GalleryImage, as: 'images' }
    });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    console.error('Get Category Error:', error);
    res.status(500).json({ message: 'Failed to retrieve category', error });
  }
};

exports.bulkDeleteCategories = async (req, res) => {
  try {
    const { ids } = req.body;
    const deleted = await Category.destroy({ where: { id: ids } });
    res.json({ deleted });
  } catch (error) {
    console.error('Bulk Delete Categories Error:', error);
    res.status(500).json({ message: 'Failed to delete categories', error });
  }
};
