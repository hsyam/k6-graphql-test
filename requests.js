import http from 'k6/http';
import { addToCartQuery, createAndVerifyCustomerQuery, createCartQuery, createCustomerShippingAddressQuery, customerQuery, deliveryDaysQuery, getProductsQuery, loginQuery, mergeCartQuery, placeOrderQuery, setBillingAddressOnCartQuery, setPaymentMethodOnCartQuery, setShippingMethodsOnCartQuery } from './queries.js';

export function request(query,headers = {}){
    return http.post('https://mcstaging.seoudisupermarket.com/graphql',JSON.stringify(query),{
        "headers" : Object.assign({},headers,{
            "Content-Type" : "application/json",
            "Accept" : "*/*" ,
        })
    })
}

export function Login(phone,password)  {
    return request(
            loginQuery(phone,password)
        )
 }

export function getCustomer(token){
    const query = customerQuery()
    const headers = {
        "authorization" :  `bearer ${token}`,
    }
    return request(query,headers) ;
}

export function createCart(token){
    const query  = createCartQuery();
    const headers = {
        "authorization" :  `bearer ${token}`,
    }
    return request(query,headers) ;
}

export function getProducts(sourceCode,search = " "){
    const query = getProductsQuery(search)
    const headers = {
        "sourceCode" :  sourceCode
    }
    return request(query,headers) ;

}

export function addToCart(token,sourceCode,cartId,products){
    const query = addToCartQuery(cartId,products)
    const headers = {
        "authorization" :  `bearer ${token}`,
        "sourceCode" :  sourceCode
    }
    return request(query,headers) ;
}

export function setBillingAddressOnCart(token,sourceCode,cartId,addressId){
    const query = setBillingAddressOnCartQuery(cartId,addressId)
    const headers = {
        "authorization" :  `bearer ${token}`,
        "sourceCode" :  sourceCode
    }
    return request(query,headers) ;
}

export function deliveryIntervals(token,sourceCode,districtId){
    const query = deliveryDaysQuery(districtId)
    const headers = {
        "authorization" :  `bearer ${token}`,
        "sourceCode" :  sourceCode
    }
    return request(query,headers) ;
}

export function setShippingMethodsOnCart(token,sourceCode,district_id,cartId,carrierCode,methodCode,delivery_day_timestamp,delivery_interval_id){

    const query = setShippingMethodsOnCartQuery(cartId,carrierCode,methodCode,delivery_day_timestamp,delivery_interval_id,district_id)
    const headers = {
        "authorization" :  `bearer ${token}`,
        "sourceCode" :  sourceCode
    }
    return request(query,headers) ;
}

export function setPaymentMethodOnCart(token,sourceCode,cartId,paymentCode){
    const query = setPaymentMethodOnCartQuery(cartId,paymentCode)
    const headers = {
        "authorization" :  `bearer ${token}`,
        "sourceCode" :  sourceCode
    }
    return request(query,headers) ;
}

export function placeOrder(token,sourceCode,cartId){
    const query = placeOrderQuery(cartId)
    const headers = {
        "authorization" :  `bearer ${token}`,
        "sourceCode" :  sourceCode
    }
    return request(query,headers) ;
}

export function createAndVerifyCustomer(customerData){
    const query = createAndVerifyCustomerQuery(customerData)
    return request(query) ;
}

export function createCustomerShippingAddress(token,firstName,lastName,phoneNumber,cityName,cityCode,cityId,areaCode,districtCode){
    const query = createCustomerShippingAddressQuery(firstName,lastName,phoneNumber,cityName,cityCode,cityId,areaCode,districtCode)
    const headers = {
        "authorization" :  `bearer ${token}`,
    }
    return request(query,headers) ;
}

export function mergeCart(token,source_cart_id,destination_cart_id){
    const query = mergeCartQuery(source_cart_id,destination_cart_id)
    const headers = {
        "authorization" :  `bearer ${token}`,
    }
    return request(query,headers) ;
}

