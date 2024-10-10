import './Payment.css';
import closeIcon from '../../assets/close.png'
import { useState } from 'react';
import { insertCustomer, insertOrder, insertOrderDetail } from '../../api/api';

function Payment({cart, totalPrice, setGoToPayment, setCart}) {

    const [name, setName] = useState('');
    const [phonenumber, setPhonenumber] = useState(null);
    const [address, setAddress] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');

    var quantity = 0;
    
    const handleCheckOut = async (e) => {  
        try {  
            const response = await insertCustomer(name, phonenumber, address, country, city, cart);  
            const response2 = await insertOrder(response.data, totalPrice);
            const response3 = await insertOrderDetail(response2.data, cart);
        } catch (error) {  
            console.error('Error:', error);  
        } 
    };  
    
    return (
        <div className="payment-section">
            <div className="payment-products">
                <div className="payment-products-header">
                    List Of Products
                </div>
                <div className="payment-products-list">
                    {
                    cart.map( shoe => (
                        <div className="payment-item" key={"payment-shoe-" + shoe.id}>
                            <div className="shoe-payment-img-container" style={{backgroundColor: shoe.color}}>
                                <img src={shoe.image} alt={shoe.name} />
                            </div>
                            <div className="shoe-payment-right">
                                <div className="shoe-info">
                                    <p className="shoe-payment-name">{shoe.name}</p>
                                    <p className="shoe-payment-price">{"$" + shoe.price + " per product"}</p>
                                </div>
                                <div className="shoe-payment-amount">{shoe.amount}</div>
                                <div className="shoes-payment-total">
                                    {"$"+shoe.price * shoe.amount}
                                </div>
                            </div>
                        </div>
                        ))
                    }    
                </div>                
            </div>

            <div className="payment-info">
                <div className="payment-info-header">
                    <p>Checkout</p>
                    <div className="close-btn" onClick={() => setGoToPayment(false)}>
                        <img src={closeIcon}/>
                    </div>
                </div>  
                <div className="payment-info-detail">
                    <div className="payment-info-submit">
                        <p className="payment-info-title">Full Name</p>
                        <input id="fullname" className="payment-info-input"type="text" value={name}
                                onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="payment-info-submit">
                        <p className="payment-info-title">Phone Number</p>
                        <input id="phonenumber" className="payment-info-input"type="text" value={phonenumber}
                                onChange={(e) => setPhonenumber(e.target.value)}
                        />
                    </div>
                    <div className="payment-info-submit">
                        <p className="payment-info-title">Address</p>
                        <input id="address" className="payment-info-input"type="text" value={address}
                                onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>

                    <div id="address-detail" className="payment-info-submit">
                        <div className="payment-info-submit">
                            <p className="payment-info-title">Country</p>
                            <input id="country" className="payment-info-input"type="text" value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                            />
                        </div>
                        <div className="payment-info-submit">
                            <p className="payment-info-title">City</p>
                            <input id="city" className="payment-info-input"type="text" value={city}
                                    onChange={(e) => setCity(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="divider"></div>

                <div className="payment-total">
                    <div className="payment-total-element">
                        <div className="total-title">
                            Total Quantity
                        </div>
                        <div className="total-content">
                            {
                                cart.map((shoe, index) => {
                                    quantity += shoe.amount;
                                    if (index === cart.length - 1)
                                        return quantity;
                                })
                            }
                        </div>
                    </div>
                    <div className="payment-total-element">
                        <div className="total-title">
                            Total Quantity
                        </div>
                        <div className="total-content">{"$" + totalPrice.toFixed(2)}</div>
                    </div>
                </div>

                <div className="payment-checkout" onClick={() => handleCheckOut()}>
                    Check Out
                </div>
            </div>
        </div>
    )
}

export default Payment;