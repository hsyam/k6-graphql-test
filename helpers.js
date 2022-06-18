import faker from 'https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.min.js';

export function getRandomProducts(list,limit){
    let products = [];
    let filterdList = list.filter((p)=>{
        return p.only_x_left_in_stock > 0
    })
    if(filterdList.length > limit){
        for (let i = 0; i < limit; i++) {
            let product = filterdList[Math.floor(Math.random() * filterdList.length)]
            products.push(product)
        }
        return products;
    }else{
        return filterdList;
    }
}

export function mapProductsToCart(products){
    let mappedProducts = []
    products.map((p)=>{
        mappedProducts.push({
            "sku": p.sku,
            "quantity": 1
        })
    })
    return mappedProducts;
}

export function getAsSoonAsPossibleInterval(intervals){
  
    let deliveryDates = intervals.map((t)=>{
        return { 
            "timestamp": t.timestamp,
            "intervals"  : t.intervals.filter((i)=>{
                return i.availability == true
             })
        }
    })
    return {
        "delivery_day_timestamp" : deliveryDates[0].timestamp , 
        "store_delivery_interval_quote_id" : deliveryDates[0].intervals[0].id
    };

}

export function generateCustomerData(){
    let number = "011" + faker.random.number({
        'min': 10000000,
        'max': 99999999
    })
    return {
        firstname:faker.name.firstName(),
        lastname:faker.name.lastName(),
        phone_number:number,
        email:faker.internet.email(),
        password:"User@123",
    }
}