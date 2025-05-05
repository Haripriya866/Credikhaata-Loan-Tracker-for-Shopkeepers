const Customer = require("../models/Customer");
const validator = require("validator");
const mongoose = require("mongoose");


// Create a new customer
exports.createCustomer = async (request, response) => {
  try {
    const { name, phone, address, trustScore, creditLimit } = request.body;

    if (!name || !phone) {
      return response.status(400).json({
        success: false,
        message: "Name and phone are required.",
      });
    }

    if (!validator.isMobilePhone(phone, 'any', { strictMode: false })) {
      return response.status(400).json({
        success: false,
        message: "Invalid phone number format.",
      });
    }

    if (trustScore !== undefined && (trustScore < 0 || trustScore > 10)) {
      return response.status(400).json({
        success: false,
        message: "Trust score must be between 0 and 10.",
      });
    }

    const customer = new Customer({
      name,
      phone,
      address,
      trustScore,
      creditLimit,
      user: request.user._id,
    });

    await customer.save();

    return response.status(201).json({
      success: true,
      message: "Customer created successfully.",
      data: customer,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: "Failed to create customer.",
      error: error.message,
    });
  }
};

// Get all customers for the logged-in user
exports.getCustomers = async (request, response) => {
  try {
    const customers = await Customer.find({ user: request.user._id });
    return response.status(200).json({
      success: true,
      message: "Customers retrieved successfully.",
      data: customers,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: "Failed to retrieve customers.",
      error: error.message,
    });
  }
};

// Update a customer
exports.updateCustomer = async (request, response) => {
  try {
    const { name, phone, address, trustScore, creditLimit } = request.body;

    if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
        return response.status(404).json({
          success: false,
          message: "Customer not found.",
        });
      }

    if (phone && !validator.isMobilePhone(phone, 'any', { strictMode: false })) {
      return response.status(400).json({
        success: false,
        message: "Invalid phone number format.",
      });
    }

    if (trustScore !== undefined && (trustScore < 0 || trustScore > 10)) {
      return response.status(400).json({
        success: false,
        message: "Trust score must be between 0 and 10.",
      });
    }

    const updatedCustomer = await Customer.findOneAndUpdate(
      { _id: request.params.id, user: request.user._id },
      { name, phone, address, trustScore, creditLimit },
      { new: true }
    );

    if (!updatedCustomer) {
      return response.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    return response.status(200).json({
      success: true,
      message: "Customer updated successfully.",
      data: updatedCustomer,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: "Failed to update customer.",
      error: error.message,
    });
  }
};

// Delete a customer
exports.deleteCustomer = async (request, response) => {
  try {
    const deletedCustomer = await Customer.findOneAndDelete({
      _id: request.params.id,
      user: request.user._id,
    });

    if (!deletedCustomer) {
      return response.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    return response.status(200).json({
      success: true,
      message: "Customer deleted successfully.",
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: "Failed to delete customer.",
      error: error.message,
    });
  }
};
