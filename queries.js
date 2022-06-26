export function loginQuery (phone,password) {
    return {
        "operationName": "Login",
        "query": `mutation($phone:String!,$password:String!) {
            generateCustomerToken(email:$phone password:$password){
            token
            }
        }`,
        "variables": {
            "phone": phone,
            "password": password
        }
    }
}

export function customerQuery () {
    return  {
        "operationName": "getCusotmer",
        "query": `{
            customer{
                      firstname
                      lastname
                      addresses{
                        address_name
                        id
                        district{
                          available_store{
                            id
                            storeSource{
                              source_code
                            }
                          }
                          code
                          id
                        }
                      }
                    }
        }`,
        "variables": {}
    };
}

export function createCartQuery(){
    return {
        "operationName": "createEmptyCart",
        "query": `mutation{createEmptyCart}`,
        "variables": {}
    }
}

export function getProductsQuery(search = " "){
  return {
    "operationName": "productsSearch",
    "query": `query productsSearch($search:String!){
      products(search:$search,pageSize:1000){
        total_count
        items{
          name
          sku
          only_x_left_in_stock
        }
      }
    }`,
    "variables": {
      "search": search
    }
  }
}

export function addToCartQuery(cartId,products){
  return {
    "operationName": "addToCart",
    "query": `mutation addToCart($cartId:String!,$products:[CartItemInput!]!){
      addProductsToCart(cartId:$cartId,cartItems:$products){
        cart{
          id
          items{
            id
            product{
              sku
            }
          }
        }
      }
    }`,
    "variables": {
      "cartId": cartId,
      "products":products
    }
  }
}

export function setBillingAddressOnCartQuery(cartId,addressId){
  return {
    "operationName": "setBillingAddressOnCart",
    "query": `mutation setBillingAddressOnCart($cartId:String!,$addressId:Int!){
      setBillingAddressOnCart(input:{
        cart_id: $cartId
        billing_address:{
          customer_address_id:$addressId
          same_as_shipping:true
        }
      }){
        cart{
          id
          shipping_addresses{
            available_shipping_methods{
              carrier_code
              method_code
            }
          }
          available_payment_methods{
            code
          }
        }
      }
    }`,
    "variables": {
      "cartId": cartId,
      "addressId": addressId,
    }
  }
}

export function deliveryDaysQuery(districtId){
  return {
    "operationName": "deliveryDays",
    "query": `query deliveryDays($districtId:String!){
      deliverydays(districtId:$districtId){
        timestamp
        intervals{
          id
          availability
        }
      }
    }`,
    "variables": {
        "districtId": districtId
    }
  }
}

export function setShippingMethodsOnCartQuery(cartId,carrierCode,methodCode,delivery_day_timestamp,delivery_interval_id,district_id){
  return {
    "operationName": "setShippingMethodsOnCart",
    "query": `mutation setShippingMethodsOnCart($cartId:String!,$carrierCode:String!,$methodCode:String!,$delivery_day_timestamp:String!,$delivery_interval_id:Int!,$district_id:Int! )  {
      setShippingMethodsOnCart(input:{
        cart_id:$cartId,
        shipping_methods:{
          carrier_code:$carrierCode,
          method_code:$methodCode,
        }
        delivery_day_timestamp:$delivery_day_timestamp
        store_delivery_interval_quote_id:$delivery_interval_id,
        district_id:$district_id
      }){
        cart{
          id
        }
      }
    }`,
    "variables": {
      "cartId": cartId,
      "carrierCode": carrierCode,
      "methodCode": methodCode,
      "delivery_day_timestamp": delivery_day_timestamp,
      "delivery_interval_id": delivery_interval_id,
      "district_id": district_id
    }
  }
}

export function setPaymentMethodOnCartQuery(cartId,paymentCode){
  return {
    "operationName": "setPaymentMethodOnCart",
    "query": `mutation setPaymentMethodOnCart($cart_id:String!,$payment_code:String!){
      setPaymentMethodOnCart(input:{
        cart_id:$cart_id,
        payment_method:{
          code:$payment_code
        }
      }){
        cart{
          id
        }
      }
    }`,
    "variables": {
      "cart_id": cartId,
      "payment_code": paymentCode
    }
  }
}


export function placeOrderQuery(cartId){
  return {
    "operationName": "placeOrder",
    "query": `mutation placeOrder($cart_id:String!) {
      placeOrder(input:{
        cart_id:$cart_id
      }){
        order{
          order_number
        }
      }
    }`,
    "variables": {
      "cart_id": cartId    
    }
  }
}

export function createAndVerifyCustomerQuery(customerData){
  return {
    "operationName": "placeOrder",
    "query": `mutation createAndVerifyCustomer(
      $firstname:String!,
      $lastname:String!,
      $phone_number:String!,
      $email:String!,
      $password:String!
    ) {
      createCustomer(input:{
        firstname:$firstname
        lastname:$lastname
        phone_number:$phone_number
        email:$email
        password:$password
        customer_source:"ca-web"
        customer_registered_web:true
      }){
        customer{
          phone_number
        }
      }
       verifyCustomer(username:$phone_number otp:"1111"){
        token
      }
    }
    `,
    "variables": customerData
  }
}


export function createCustomerShippingAddressQuery(firstName,lastName,phoneNumber,cityName,cityCode,cityId,areaCode,districtCode){
  return {
    "operationName": "createCustomerShippingAddress",
    "query": `mutation createCustomerShippingAddress($firstName: String!, $lastName: String!, $phoneNumber: String!, $cityName: String!, $cityCode: String!, $cityId: Int!, $areaCode: String!, $districtCode: String!, $street: String!, $defaultBilling: Boolean!, $defaultShipping: Boolean!, $countryCode: CountryCodeEnum!, $postcode: String!, $customAttributes:[CustomerAddressAttributeInput]) { createCustomerAddress(input: {firstname: $firstName, lastname: $lastName, telephone: $phoneNumber, city: $areaCode, region: {region: $cityName, region_code: $cityCode, region_id: $cityId}, district: $districtCode, street: [$street], default_billing: $defaultBilling, default_shipping: $defaultShipping, country_code: $countryCode, postcode: $postcode, custom_attributes: $customAttributes}){
      address_name
    }
    }`,
    "variables": {
      "firstName": firstName,
       "lastName": lastName,
       "phoneNumber": phoneNumber,
       "cityName": cityName,
       "cityCode": cityCode,
       "cityId": cityId,
       "areaCode": areaCode,
       "districtCode": districtCode,
       "street": "Test ST",
       "defaultBilling": true,
       "defaultShipping": true,
       "countryCode": "EG",
       "postcode": "77777",
       "customAttributes": [
         {
           "attribute_code": "address_name",
           "value": "Home"
         },
         {
           "attribute_code": "building",
           "value": "1"
         },
         {
           "attribute_code": "floor",
           "value": "1"
         },
         {
           "attribute_code": "apartment",
           "value": "2"
         },
         {
           "attribute_code": "customer_note",
           "value": ""
         },
         {
           "attribute_code": "compound",
           "value": ""
         }
       ]
   }
  }
}


export function mergeCartQuery(source_cart_id,destination_cart_id){
  return {
    "operationName": "mergeCart",
    "query": `mutation mergeCart($source_cart_id:String!,$destination_cart_id:String!){ mergeCarts(source_cart_id:$source_cart_id,destination_cart_id:$destination_cart_id){
      id
    items{
      product{
        sku
      }
    }
    }
  }`,
    "variables": {
      "source_cart_id": source_cart_id,
      "destination_cart_id": destination_cart_id
    }
  }
}


export function AddAddressToGuestCartQuery(cartId,firstName,lastName,phoneNumber,street,areaCode,districtCode,region,regionId){
  return {
    "operationName": "mergeCart",
    "query": `mutation setBillingAddressOnCart(
      $cartId: String!
      $firstName: String!
      $lastName: String!
      $phoneNumber: String!
      $areaCode: String!
      $districtCode: String!
      $street: String!
      $countryCode: String!
      $postcode: String!
      $region: String! 
      $regionId: Int!
  
    ) {
      setBillingAddressOnCart(
        input: {
          cart_id: $cartId
          billing_address: {
            address: {
              firstname: $firstName
              lastname: $lastName
              telephone: $phoneNumber
              city: $areaCode
              district: $districtCode
              street: [$street]
              country_code: $countryCode
              postcode: $postcode, 
              region:$region
              region_id:$regionId
              
            }
            same_as_shipping: true
          }
        }
      ) {
        cart {
          id
          shipping_addresses {
            district{
              id
            }
            available_shipping_methods {
              carrier_code
              method_code
            }
          }
          available_payment_methods {
            code
          }
        }
      }
    }
    `,
    "variables": {
      "cartId": cartId,
      "firstName": firstName,
      "lastName": lastName,
      "phoneNumber": phoneNumber,
      "street": street,
      "postcode": "123456",
      "areaCode": areaCode ,
      "districtCode":districtCode,
      "countryCode" : "EG",
      "region": region,
      "regionId": regionId
    }
  }
}
