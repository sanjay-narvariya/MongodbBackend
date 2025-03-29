const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const sendResponse = require("../../middleware/response");
const ErrorHandler = require("../../utils/ErrorHandler");
const SelectedService = require("./selected-services-model");

exports.createSelectedServiceByCustomer = catchAsyncErrors(async (req, res, next) => {
    try {

        const customerID = req.params.customerid;
        const newSelectedService = await SelectedService.create({ ...req.body, customer_id: customerID });

        sendResponse(res, 200, "Selected Service Created Successfully", newSelectedService);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.getSelectedServicesByCustomer = catchAsyncErrors(async (req, res, next) => {
    try {
        const customerID = req.params.customerid;

        // const selectedService = await SelectedService.find({ customer_id: customerID }).populate('selected_sub_service_id')
        const selectedService = await SelectedService.find({ customer_id: customerID })
            .populate({
                path: 'selected_sub_service_id',
                populate: {
                    path: 'parent_service_id'
                }
            });

        // Extract unique selected_sub_service_id entries
        const uniqueSelectedServices = [];
        const seenSubServiceIds = new Set();

        for (const service of selectedService) {
            const subServiceId = service.selected_sub_service_id._id.toString();
            if (!seenSubServiceIds.has(subServiceId)) {
                seenSubServiceIds.add(subServiceId);
                uniqueSelectedServices.push(service);
            }
        }

        sendResponse(res, 200, "Selected Services By Customer Data Fetched Successfully", uniqueSelectedServices);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.deleteSelectedServiceByServiceId = catchAsyncErrors(async (req, res, next) => {
    try {
        const serviceID = req.params.id;
        const customerID = req.body.customer_id;

        // const selectedServiceData = await SelectedService.findOne({ _id: serviceID });
        const selectedServiceData = await SelectedService.findOne({
            _id: serviceID,
            customer_id: customerID
        });

        if (!selectedServiceData) {
            return next(new ErrorHandler("Selected Service Not Exist", 400));
        }

        // const selectedService = await SelectedService.deleteOne({ _id: serviceID });
        const deletedSelectedService = await SelectedService.findOneAndDelete({ _id: serviceID, customer_id: customerID });

        sendResponse(res, 200, "Selected Service Deleted Successfully.", deletedSelectedService);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})


exports.clearCartByCustomer = catchAsyncErrors(async (req, res, next) => {
    try {
        const customerID = req.params.customerid;

        const deletedSelectedService = await SelectedService.deleteMany({
            customer_id: customerID
        });

        if (!deletedSelectedService) {
            return next(new ErrorHandler("Selected Service Not Exist", 400));
        }

        sendResponse(res, 200, "Selected Service Deleted Successfully.", deletedSelectedService);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});