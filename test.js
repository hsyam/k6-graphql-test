import { check, sleep,group } from 'k6';
import {Login, getCustomer, createCart, getProducts, addToCart,setBillingAddressOnCart, deliveryIntervals, setShippingMethodsOnCart, setPaymentMethodOnCart, placeOrder, createAndVerifyCustomer, createCustomerShippingAddress, mergeCart, AddAddressToGuestCart} from './requests.js'
import { generateCustomerData, getAsSoonAsPossibleInterval, getRandomProducts, mapProductsToCart } from './helpers.js';

// export const options = {
//     stages: [
//       { duration: '10s', target: 10 },

//     ],
// };
  
export default function ()  {

    group('Checkout', (_) => {
        // CreateCart
        let createGuestCartRes = createCart(""); 
        let guestCartId = JSON.parse(createGuestCartRes.body).data.createEmptyCart
        check(createGuestCartRes, { 'Create Guest Cart 200': (r) => r.status == 200 });
        let guestSourceCode = 19
        // Get Guest List of products of random. 
        let guestproductsRes = getProducts(guestSourceCode)
        check(guestproductsRes, { 'Get List of Products 200': (r) => r.status == 200 });
        let guestproducts = JSON.parse(guestproductsRes.body).data.products
        let guestrandomAvailableProducts = getRandomProducts(guestproducts.items,3)
        // Add Guest To Cart
        let guestaddToCartRes = addToCart("",19,guestCartId,mapProductsToCart(guestrandomAvailableProducts))
        check(guestaddToCartRes, { 'Adding to Cart 200': (r) => r.status == 200 });
        // Create Guest Cart Address
        let customerData = generateCustomerData();
        let CreateGuestAddress = AddAddressToGuestCart(guestCartId,customerData.firstname,customerData.lastname,customerData.phone_number,
            "St","Zayed","4450","GZ","2519"
            )
        let cart = (JSON.parse(CreateGuestAddress.body)).data.setBillingAddressOnCart.cart
        check(CreateGuestAddress, { 'Create Guest Cart Address 200': (r) => r.status == 200 });
        // Get Delivery Dates
        let deliveryDays = deliveryIntervals("",guestSourceCode,cart.shipping_addresses[0].district.id)
        check(deliveryDays, { 'Get Delivery Dates 200': (r) => r.status == 200 });
        let asSoonAsPossibleInterval = getAsSoonAsPossibleInterval(JSON.parse(deliveryDays.body).data.deliverydays) ; 
        let deliveryMethod =  cart.shipping_addresses[0].available_shipping_methods[1];
        // Set Shipping Methods
        let setShippingMethods = setShippingMethodsOnCart(
            "",
            guestSourceCode,
            cart.shipping_addresses[0].district.id,
            guestCartId,
            deliveryMethod.carrier_code,
            deliveryMethod.method_code,
            asSoonAsPossibleInterval.delivery_day_timestamp,
            asSoonAsPossibleInterval.store_delivery_interval_quote_id,
            )
        check(setShippingMethods, { 'Set Shipping Methods 200': (r) => r.status == 200 });
        // Set Payment Methods
        let setPaymentMethod = setPaymentMethodOnCart("",guestSourceCode,guestCartId,cart.available_payment_methods[3].code)
        check(setPaymentMethod, { 'Set Payment Methods 200': (r) => r.status == 200 });
    })
    sleep(1);
}