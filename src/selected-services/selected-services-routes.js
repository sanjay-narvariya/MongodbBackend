const { Router } = require("express");
const { createSelectedServiceByCustomer, deleteSelectedServiceByServiceId, getSelectedServicesByCustomer, clearCartByCustomer } = require("./selected-services-controller");

const router = Router();

router.post("/create-selected-service/:customerid", createSelectedServiceByCustomer);

router.get("/get-selected-services-by-customer/:customerid", getSelectedServicesByCustomer);

router.post("/delete-selected-service-by-serviceId/:id", deleteSelectedServiceByServiceId);

router.get("/clear-cart-by-customer/:customerid", clearCartByCustomer);

module.exports = router;
