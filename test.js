import { check, sleep,group } from 'k6';
import {Login, getCustomer, createCart, getProducts, addToCart,setBillingAddressOnCart, deliveryIntervals, setShippingMethodsOnCart, setPaymentMethodOnCart, placeOrder, createAndVerifyCustomer, createCustomerShippingAddress, mergeCart} from './requests.js'
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

        // Create Customer
        let customerData = generateCustomerData();
        let createCustomer = createAndVerifyCustomer(customerData)
        check(createCustomer, { 'Create Customer 200': (r) => r.status == 200 });
        //Login
        let loginRes = Login(customerData.phone_number,customerData.password);
        let token = JSON.parse(loginRes.body);
        token = token.data.generateCustomerToken.token;
        //Login Check
        check(loginRes, { 'Login 200': (r) => r.status == 200 });
        // Create Address 
        // Change Address info based on testing env 
        let customerAddress = createCustomerShippingAddress(
            token,customerData.firstname,customerData.lastname,customerData.phone_number,
            "Giza","GZ", 2519, "Zayed", "4450",
            );
        check(customerAddress, { 'Create Address 200': (r) => r.status == 200 });
        // Get Customer
        let customerRes = getCustomer(token)
        check(customerRes, { 'Get Customer 200': (r) => r.status == 200 });
        let customer = JSON.parse(customerRes.body).data.customer
        // get Address
        let address = customer.addresses[0] 
        let sourceCode = address.district.available_store.storeSource.source_code
        // CreateCart
        let createCartRes = createCart(token); 
        let cartId = JSON.parse(createCartRes.body).data.createEmptyCart
        check(createCartRes, { 'Create Cart 200': (r) => r.status == 200 });
        // Get List of products of random. 
        let productsRes = getProducts(sourceCode)
        check(productsRes, { 'Get List of Products 200': (r) => r.status == 200 });
        let products = JSON.parse(productsRes.body).data.products
        let randomAvailableProducts = getRandomProducts(products.items,3)
        // Add To Cart
        let addToCartRes = addToCart(token,sourceCode,cartId,mapProductsToCart(randomAvailableProducts))
        let cart = JSON.parse(addToCartRes.body).data.addProductsToCart.cart
        let setBillingAddress = setBillingAddressOnCart(token,sourceCode,cartId,address.id)
        cart = JSON.parse(setBillingAddress.body).data.setBillingAddressOnCart.cart
        check(addToCartRes, { 'Adding to Cart 200': (r) => r.status == 200 });
        // Merge Cart
        let mergeCartRes = mergeCart(token,guestCartId,cartId)
        check(mergeCartRes, { 'Merge Carts 200': (r) => r.status == 200 });
        // Get Delivery Dates
        let deliveryDays = deliveryIntervals(token,sourceCode,address.district.id)
        check(deliveryDays, { 'Get Delivery Dates 200': (r) => r.status == 200 });
        let asSoonAsPossibleInterval = getAsSoonAsPossibleInterval(JSON.parse(deliveryDays.body).data.deliverydays) ; 
        let deliveryMethod =  cart.shipping_addresses[0].available_shipping_methods[1];
        // Set Shipping Methods
        let setShippingMethods = setShippingMethodsOnCart(
            token,
            sourceCode,
            address.district.id,
            cartId,
            deliveryMethod.carrier_code,
            deliveryMethod.method_code,
            asSoonAsPossibleInterval.delivery_day_timestamp,
            asSoonAsPossibleInterval.store_delivery_interval_quote_id,
            )
        check(setShippingMethods, { 'Set Shipping Methods 200': (r) => r.status == 200 });
        // Set Payment Methods
        let setPaymentMethod = setPaymentMethodOnCart(token,sourceCode,cartId,cart.available_payment_methods[3].code)
        check(setPaymentMethod, { 'Set Payment Methods 200': (r) => r.status == 200 });
        // Place order
        let order = placeOrder(token,sourceCode,cartId)
        check(order, { 'Place Order 200': (r) => r.status == 200 });
    })
    sleep(1);
}