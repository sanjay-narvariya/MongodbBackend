const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const sendResponse = require("../../middleware/response");
const ErrorHandler = require("../../utils/ErrorHandler");
const Customer = require("../customer/customer-model");
const MembershipPurchased = require("./membership-purchased-model");
const fs = require('fs');

exports.createMembershipPurchased = catchAsyncErrors(async (req, res, next) => {
    try {
        const { customer_id } = req.body;

        const newMembershipPurchased = await MembershipPurchased.create(req.body);

        const customer = await Customer.findById(customer_id);

        customer.is_membership = true;

        await customer.save();

        sendResponse(res, 200, "Membership Purchased Created Successfully", newMembershipPurchased);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})

exports.getAllMembershipPurchased = catchAsyncErrors(async (req, res, next) => {
    try {

        const { pageNumber } = req.query;
        const totoalCustomers = await MembershipPurchased.countDocuments();

        const membershipCustomers = await MembershipPurchased.find({})
            .populate("customer_id")
            .skip((pageNumber - 1) * 15)
            .sort({ created_at: -1 })
            .limit(15);

        sendResponse(res, 200, "Membership Customers Fetched Successfully", {
            totalCustomers: totoalCustomers,
            totalPages: Math.ceil(totoalCustomers / 15),
            currentPage: parseInt(pageNumber, 10),
            membershipCustomers,
        });

    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})


exports.getAllMembershipPurchasedByCityAndDate = catchAsyncErrors(async (req, res, next) => {
    try {
        const { city, from, to } = req.body;

        if (!from || !to || !city) {
            return res.status(400).json({ error: 'City, From and To dates are required' });
        }

        const fromDate = new Date(from);
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999); // End of the 'to' day

        // Fetch customers in the specified city
        const customers = await Customer.find({ 'address.city': city }).select('_id');

        if (!customers.length) {
            return res.status(404).json({ error: 'No customers found in the specified city' });
        }

        const customerIds = customers.map(customer => customer._id);

        // Fetch bookings for those customers within the specified date range
        const membershipPurchased = await MembershipPurchased.find({
            customer_id: { $in: customerIds },
            created_at: {
                $gte: fromDate,
                $lte: toDate
            },
        });


        // Format the response
        const responseData = membershipPurchased.map(membership => ({
            totalSales: membership?.amount,
            fromDate: fromDate.toISOString().split('T')[0],
            toDate: toDate.toISOString().split('T')[0],
            city: city
        }));

        sendResponse(res, 200, "Data fetched successfully", responseData);

    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})


exports.checkMembershipPurchasedByCustomer = catchAsyncErrors(async (req, res, next) => {
    try {
        const membershipPurchased = await MembershipPurchased.findOne({
            customer_id: req.params.id
        });

        if (!membershipPurchased) {
            // sendResponse(res, 200, "Data fetched successfully", membershipPurchased);
            return res.status(200).json({ status: false, data: "customer have not membership" })
        }
        else {
            sendResponse(res, 200, "Data fetched successfully", membershipPurchased);
        }

    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});