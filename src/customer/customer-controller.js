const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const Customer = require("./customer-model");
const ErrorHandler = require("../../utils/ErrorHandler");
const sendResponse = require("../../middleware/response");
const sendToken = require("../../utils/jwtToken");
const fs = require('fs');
const ShortUniqueId = require("short-unique-id");
const { sendVerificationEmailUser, sendEmailUpdateOtp } = require("../../utils/mail");
const SuperAdmin = require("../super-admin/super-admin-model");
const jwt = require('jsonwebtoken');

const { subDays, startOfDay, endOfDay } = require("date-fns");
const Vendor = require("../vendor/vendor-model");
const MembershipPurchased = require("../membership-purchased/membership-purchased-model");

exports.createCustomer = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email, phone } = req?.body;
    const uniqueNumId = new ShortUniqueId({ length: 3, dictionary: "number" });
    const uniqueAlpId = new ShortUniqueId({ length: 3, dictionary: "alpha_upper" });

    const currentUniqueId = uniqueNumId.rnd();
    const currentAlpId = uniqueAlpId.rnd();

    const UserName = `User${currentAlpId}${currentUniqueId}`

    const customer = await Customer.findOne({ phone });

    if (customer) {
      return next(new ErrorHandler("User already exists", 400));
    }

    const newCustomer = await Customer.create({ ...req.body, user_name: UserName });
    sendToken(newCustomer, 200, res, "Account created successfully");
    // sendResponse(res, 200, "Account created successfully", newCustomer);
  } catch (error) {
    console.log('create customer error : ', error);
    return next(new ErrorHandler(error.message, 500));
  }
});


exports.getAllCustomer = catchAsyncErrors(async (req, res, next) => {
  try {
    const { pageNumber } = req.query;
    const totalCustomers = await Customer.countDocuments();

    const customer = await Customer.find()
      .sort({ created_at: -1 })
      .skip((pageNumber - 1) * 15)
      .limit(15);

    sendResponse(res, 200, "Customer Data Fetched Successfully", {
      totalCustomers: totalCustomers,
      totalPages: Math.ceil(totalCustomers / 15),
      currentPage: parseInt(pageNumber, 10),
      customer,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

exports.getCustomerByID = catchAsyncErrors(async (req, res, next) => {
  try {
    const customerId = req.params.id;
    const customer = await Customer.findById(customerId);

    sendResponse(res, 200, "Customer data fetched successfully.", customer);

  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

exports.deleteCustomerByID = catchAsyncErrors(async (req, res, next) => {
  try {
    const customerId = req.params.id;

    let customerData = await Customer.findById(customerId);

    if (!customerData) {
      return next(new ErrorHandler("Customer doesn't exists!", 400));
    }

    if (customerData.profile_picture) {
      fs.unlink(`uploads/profile-picture/${customer.profile_picture}`, (error) => {
        if (error) {
          return next(new ErrorHandler(error.message, 500));
        }
      })
    }

    const customer = await Customer.deleteOne({ _id: customerId });

    sendResponse(res, 200, "Customer Deleted successfully.", customer);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});


exports.updateCustomerByID = catchAsyncErrors(async (req, res, next) => {
  try {
    let customer = await Customer.findById(req.params.id);
    if (!customer) {
      return next(new ErrorHandler("Customer doesn't exists!", 400));
    }
    customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    sendResponse(res, 200, "Customer data updated successfully", customer);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

exports.createProfilePicture = catchAsyncErrors(async (req, res, next) => {
  try {
    let customer = await Customer.findById(req.params.id);

    if (!customer) {
      return next(new ErrorHandler("Customer doesn't exists!", 400));
    }

    const response = await Customer.findByIdAndUpdate(req.params.id, { "profile_picture": req.file.filename }, {
      new: true,
      runValidators: true,
    });

    sendResponse(res, 200, "Profile Picture Uploaded successfully", response);

  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

exports.deleteProfilePictureByID = catchAsyncErrors(async (req, res, next) => {
  try {
    let customer = await Customer.findById(req.params.id);

    if (!customer) {
      return next(new ErrorHandler("Customer doesn't exists!", 400));
    }

    if (customer.profile_picture) {
      fs.unlinkSync(`uploads/profile-picture/${customer.profile_picture}`)

      const response = await Customer.findByIdAndUpdate(req.params.id, { "profile_picture": "" }, {
        new: true,
        runValidators: true,
      });

      sendResponse(res, 200, "Profile Picture Deleted successfully", response);
    }
    else {
      return next(new ErrorHandler("Profile Picture Not yet Uploaded by Customer", 400));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

exports.updateProfilePictureByID = catchAsyncErrors(async (req, res, next) => {
  try {
    let customer = await Customer.findById(req.params.id);

    if (!customer) {
      return next(new ErrorHandler("Customer doesn't exists!", 400));
    }

    if (customer?.profile_picture) {
      fs.unlinkSync(`uploads/profile-picture/${customer.profile_picture}`)

      const response = await Customer.findByIdAndUpdate(req.params.id, { "profile_picture": req.file.filename }, {
        new: true,
        runValidators: true,
      });

      sendResponse(res, 200, "Profile Picture Updated successfully", response);
    }
    else {
      fs.unlinkSync(`uploads/profile-picture/${req.file.filename}`)
      return next(new ErrorHandler("Profile Picture Not yet Uploaded by Customer", 400));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});



exports.sendVerificationEmail = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email } = req.body;

    const uniqueId = new ShortUniqueId({ length: 4, dictionary: "number" });
    const currentUniqueId = uniqueId.rnd();

    const customer = await Customer.findOne({ email });

    if (!customer) {
      return next(new ErrorHandler("Customer not found", 404));
    }

    customer.otp = currentUniqueId;
    await customer.save();

    let mail_data = {
      otp: currentUniqueId,
      username: email,
    };

    await sendVerificationEmailUser(mail_data);

    sendResponse(res, 200, "otp sent successfully.", []);
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});


exports.verifyOtpForEmail = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // Find the Customer by email
    const customer = await Customer.findOne({ email })

    if (!customer) {
      return next(new ErrorHandler("Customer not found", 404));
    }

    // Check if the OTP matches
    if (customer.otp !== otp) {
      return next(new ErrorHandler("OTP didn't match, please try again", 400));
    }

    // Update the Cutomer to clear the OTP
    customer.is_email_verified = true;
    customer.otp = "";
    await customer.save();

    // Send the response with the updated sub-admin
    sendResponse(res, 200, "Customer email verification successful", customer);
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});


exports.sendOtpForPhone = catchAsyncErrors(async (req, res, next) => {
  try {
    const { phone } = req.body;

    const uniqueId = new ShortUniqueId({ length: 4, dictionary: "number" });
    const currentUniqueId = uniqueId.rnd();

    const customer = await Customer.findOne({ phone });

    if (!customer) {
      return res.status(404).json({ status: false, message: "Customer Not Found" })
      // return next(new ErrorHandler("Customer not found", 404));
    }

    if (!customer.is_active) {
      return res.status(500).json({ status: false, message: "Number is not active" });
    }

    customer.otp = currentUniqueId;
    await customer.save();

    sendResponse(res, 200, "otp sent successfully.", currentUniqueId);
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});


exports.verifyOtpForPhone = catchAsyncErrors(async (req, res, next) => {
  try {
    const { phone, otp } = req.body;

    // Find the Customer by email
    const customer = await Customer.findOne({ phone })

    if (!customer) {
      return next(new ErrorHandler("Customer not found", 404));
    }

    // Check if the OTP matches
    if (customer.otp !== otp) {
      return next(new ErrorHandler("OTP didn't match, please try again", 400));
    }

    // Update the Cutomer to clear the OTP
    customer.otp = "";
    await customer.save();

    // Send the response with the updated sub-admin
    sendToken(customer, 200, res, "Customer Phone verification successful");
    // sendResponse(res, 200, "Customer Phone verification successful", customer);
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});


exports.getUser = catchAsyncErrors(async (req, res, next) => {
  try {
    if (req.user) {

      const membership = MembershipPurchased.findOne({ customer_id: req.user._id })

      if (membership) {
        const currentDate = new Date();
        const expiryDate = membership?.end_date;

        if (expiryDate && currentDate > new Date(expiryDate)) {
          await Customer.findByIdAndUpdate(req.user._id, { is_membership: false });
        }
      }

      sendResponse(res, 200, "User found", req.user);
    }
    else {
      next(new ErrorHandler("User not exist", 500));
    }
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

exports.sendOtpForChangeEmail = catchAsyncErrors(async (req, res, next) => {
  try {
    const { customer_id, new_email } = req.body;

    const uniqueId = new ShortUniqueId({ length: 4, dictionary: "number" });
    const currentUniqueId = uniqueId.rnd();

    const customer = await Customer.findOne({ _id: customer_id });

    if (!customer) {
      return next(new ErrorHandler("Customer not found", 404));
    }

    customer.otp = currentUniqueId;
    await customer.save();

    let mail_data = {
      otp: currentUniqueId,
      email: new_email,
      name: customer.full_name,
    };

    await sendEmailUpdateOtp(mail_data);

    sendResponse(res, 200, "otp sent successfully.", []);
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});


exports.verifyOtpForChangeEmail = catchAsyncErrors(async (req, res, next) => {
  try {
    const { customer_id, new_email, otp } = req.body;

    // Find the Customer by email
    const customer = await Customer.findOne({ _id: customer_id })

    if (!customer) {
      return next(new ErrorHandler("Customer not found", 404));
    }

    // Check if the OTP matches
    if (customer.otp !== otp) {
      return next(new ErrorHandler("OTP didn't match, please try again", 400));
    }

    // Update the Cutomer to clear the OTP
    customer.is_email_verified = true;
    customer.email = new_email;
    customer.otp = "";
    await customer.save();

    // Send the response with the updated sub-admin
    sendResponse(res, 200, "Customer email updation successful", customer);
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});




exports.searchCustomers = catchAsyncErrors(async (req, res, next) => {
  try {

    const searchString = req.params.term;
    const { pageNumber } = req.query;

    const query = {
      $or: [
        { full_name: { $regex: searchString, $options: "i" } },
        { email: { $regex: searchString, $options: "i" } },
        { phone: { $regex: searchString, $options: "i" } },
        { address: { $elemMatch: { city: { $regex: searchString, $options: "i" } } } },
      ],
    };

    // Execute query
    const totalCustomers = await Customer.countDocuments(query);

    const customer = await Customer.find(query)
      .sort({ created_at: -1 })
      .skip((pageNumber - 1) * 15)
      .limit(15);

    if (!customer.length) {
      return next(
        new ErrorHandler("No customers found matching the criteria", 404)
      );
    }

    sendResponse(res, 200, "All Customers fetched successfully.", {
      totalCustomers: totalCustomers,
      totalPages: Math.ceil(totalCustomers / 15),
      currentPage: parseInt(pageNumber, 10),
      customer
    });

  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});


exports.getExportedCustomerData = catchAsyncErrors(async (req, res, next) => {
  const days = parseInt(req.body.days);

  try {
    let query = {};

    if (days !== 0) {
      const date = new Date();
      date.setDate(date.getDate() - days);
      query.created_at = { $gte: date };
    }

    const customers = await Customer.find(query);
    sendResponse(res, 200, "All customers fetched successfully.", customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


exports.getCustomerAndVendorCounts = catchAsyncErrors(async (req, res, next) => {
  try {
    const customerCount = await Customer.countDocuments({});
    const vendorCount = await Vendor.countDocuments({});

    return res.status(200).json({ status: true, data: { customerCount, vendorCount } });

  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});



exports.getNewCustomers = catchAsyncErrors(async (req, res, next) => {
  try {
    const newCustomers = await Customer.find()
      .limit(5)
      .sort({ created_at: -1 })

    // Map the new customer to include only the required fields
    const formattedCustomers = await Promise.all(newCustomers.map(async (customer) => {

      return {
        customer_number: customer?.phone,
        city: customer?.address?.[0]?.city,
        created_at: customer?.created_at,
      };
    }));

    sendResponse(res, 200, 'New customer fetched successfully', formattedCustomers);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});