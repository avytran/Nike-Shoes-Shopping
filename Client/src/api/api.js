import axios from 'axios';

export const getShoes = async() => {
    return axios.get('http://localhost:5000/read-shoes');
}

export const insertCustomer = async(name, phonenumber, address, country, city, cart, totalPrice) => {
    return await axios.post('http://localhost:5000/new-customer', { name: name, phonenumber: phonenumber, address: address, country: country,
                                                                city: city, cart: cart, totalPrice: totalPrice })
}

export const insertOrder = async(customerId, totalPrice) => {
    return await axios.post('http://localhost:5000/new-order', { customerId: customerId, totalPrice: totalPrice})
}

export const insertOrderDetail = async(orderId, cart) => {
    return await axios.post('http://localhost:5000/new-order-detail', { orderId: orderId, cart: cart})
}