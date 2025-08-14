const PaymentMethod = require("../models/PaymentMethod");

exports.createPaymentMethod = async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.create(req.body);
    res.status(201).json(paymentMethod);
  } catch (error) {
    console.error('Create PaymentMethod Error:', error);
    res.status(500).json({ message: 'Failed to create payment method', error });
  }
};

exports.updatePaymentMethod = async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.findByPk(req.params.id);
    if (!paymentMethod) return res.status(404).json({ message: 'Payment method not found' });
    await paymentMethod.update(req.body);
    res.json(paymentMethod);
  } catch (error) {
    console.error('Update PaymentMethod Error:', error);
    res.status(500).json({ message: 'Failed to update payment method', error });
  }
};


exports.getAllPaymentMethods = async (req, res) => {
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
    const methods = await PaymentMethod.findAndCountAll(queryOptions);
    const total = await PaymentMethod.count();
    res.json({
      data: methods.rows,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get All PaymentMethods Error:', error);
    res.status(500).json({ message: 'Failed to retrieve payment methods', error });
  }
};


exports.getPaymentMethod = async (req, res) => {
  try {
    const method = await PaymentMethod.findByPk(req.params.id);
    if (!method) return res.status(404).json({ message: 'Payment method not found' });
    res.json(method);
  } catch (error) {
    console.error('Get PaymentMethod Error:', error);
    res.status(500).json({ message: 'Failed to retrieve payment method', error });
  }
};

exports.bulkDeletePaymentMethods = async (req, res) => {
  try {
    const { ids } = req.body;
    const deleted = await PaymentMethod.destroy({ where: { id: ids } });
    res.json({ deleted });
  } catch (error) {
    console.error('Bulk Delete PaymentMethods Error:', error);
    res.status(500).json({ message: 'Failed to delete payment methods', error });
  }
};


