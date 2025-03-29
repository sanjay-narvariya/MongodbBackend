require("dotenv").config();
const express = require("express");
const cors = require('cors');
const morgan = require("morgan");
const path = require("path");
const app = express();
const socketIo = require('socket.io');


// built-in middlewares
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(morgan("dev"));
// app.use(express.urlencoded({ limit: "50mb" }));
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));

//import routes
const customerRoutes = require("./src/customer/customer-routes");
const servicesRoutes = require("./src/services/services-routes");
const subServicesRoutes = require("./src/sub-services/sub-services-routes");
const bookingRoutes = require("./src/booking/booking-routes");
const reviewRoutes = require("./src/reviews/reviews-routes");
const vendorRoutes = require("./src/vendor/vendor-routes");
const subAdminPermissionRoutes = require("./src/sub-admin-permission/sub-admin-permission-routes");
const subAdmin = require("./src/sub-admin/sub-admin-routes");
const serviceRequest = require("./src/service-request/service-request-routes");
const coupon = require("./src/coupon/coupon-routes");
const membership = require("./src/membership/membership-routes");
const serviceArea = require("./src/service-areas/service-areas-routes");
const memberShipPurchased = require("./src/membership-purchased/membership-purchased-routes");
const feedback = require("./src/feedback/feedback-routes");
const refund = require("./src/refund/refund-routes");
const superAdmin = require("./src/super-admin/super-admin-routes");
const featuredBanner = require("./src/featured-banners/featured-banners-routes");
const servicesBanners = require("./src/services-banners/services-banners-routes");
const selectedService = require("./src/selected-services/selected-services-routes");
const ContactMessage = require("./src/contact-messages/contact-messages-routes");
const faq = require("./src/faq/faq-routes");
const slot = require("./src/slot/slot-routes");
const profession = require("./src/profession/profession-routes");
const vendorPayments = require("./src/vendor-payment/vendor-payment-routes");
const newsletter = require("./src/newsletter/newsletter-routes");
const BookingCompleted = require("./src/booking-completed/booking-completed-routes");
const notifications = require("./src/notifications/notifications-routes");
const vendorNotification = require('./src/vendor-notification/vendorNotification-routes')
const VendorFaq = require('./src/vendor-faq/vendor-faq-routes')

const connectDatabase = require("./db/database");
const Notification = require("./src/notifications/notifications-model");
const Services = require("./src/services/services-model");

const assignVendorCron = require("./src/cron-jobs/assignVendor")

app.use("/api/customer", customerRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/sub-services", subServicesRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/sub-admin-permission", subAdminPermissionRoutes);
app.use("/api/sub-admin", subAdmin);
app.use("/api/service-request", serviceRequest);
app.use("/api/coupon", coupon);
app.use("/api/membership", membership);
app.use("/api/service-area", serviceArea);
app.use("/api/membership-purchase", memberShipPurchased);
app.use("/api/feedback", feedback);
app.use("/api/refund", refund);
app.use("/api/super-admin", superAdmin);
app.use("/api/featured-banner", featuredBanner);
app.use("/api/services-banners", servicesBanners);
app.use("/api/selected-service", selectedService);
app.use("/api/contact-message", ContactMessage);
app.use("/api/faq", faq);
app.use("/api/slot", slot);
app.use("/api/profession", profession);
app.use("/api/vendor-payment", vendorPayments);
app.use("/api/newsletter", newsletter);
app.use("/api/booking-completed", BookingCompleted);
app.use("/api/notifications", notifications);
app.use("/api/vendor-notification", vendorNotification);
app.use("/api/vendor-faq", VendorFaq);

//connect db
connectDatabase();

//create server//
const server = app.listen(process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT);
});

// Socket Configruation //

const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  socket.on('booking-created', async (socketData) => {
    try {

      const title = await Services.findById(socketData?.title).select('service_name');
      console.log('servicename', title)
      const newNotification = await Notification.create({ ...socketData, title: title.service_name });


      io.emit("booking-created", { status: true });
    } catch (error) {
      io.emit("booking-created", { status: false });
    }

  });


});

module.exports = app;