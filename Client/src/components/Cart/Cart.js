import { useState } from "react";
import './Cart.css'

function Cart ({nikeLogo, trash, cart, setCart, totalPrice, setTotalPrice, setGoToPayment}) {

    const increaseAmount = (shoe) => {
        const updatedCart = cart.map(item => {
          if (item.id === shoe.id){
            return { ...item, amount: item.amount + 1 };
          }
          return item;
        });
        
        setCart(updatedCart);
        setTotalPrice(prev => prev + shoe.price);
        
    };
    
    const decreaseAmount = (shoe) => {
        const updatedCart = cart.map(item => {
          if (item.id === shoe.id){
            const currAmount = shoe.amount - 1;
            return { ...item, amount: currAmount >= 1 ? currAmount : 1 };
          }
          return item;
        });
        
        setCart(updatedCart);
    
        if(shoe.amount === 1){
          removeFromCart(shoe);
        }
        else{
          setCart(updatedCart);
          setTotalPrice(prev => prev - shoe.price);
        }
        
    };
    
    const removeFromCart = (shoe) => {
        const updatedCart = cart.filter(item => item.id !== shoe.id);
        setCart(updatedCart);
        setTotalPrice(prev => Math.abs(prev - shoe.price * shoe.amount));
    };

    return (
        <div className="cart-section">
            <div className="card">
                <div className="card-corner"></div>
                <div className="logo-container">
                    <img className= "logo-nike" src={nikeLogo} />
                    <div className="cart-header">
                        <div className="card-header">Your Cart</div>
                        <div className="cart-total" style={{ float: "right" }}>
                            {totalPrice !== null && totalPrice !== undefined ? (
                                <div>${totalPrice.toFixed(2)}</div>
                                ) : (
                                <div>$0.00</div>
                            )}
                        </div>
                    </div>                
                </div>
                <div className="cart-body">
                    <div className="products-info">
                        {
                            cart.map( shoe => (
                                <div className="shoe-cart-item" key={"cart-shoe-" + shoe.id}>
                                    <div className="shoe-cart-img-container" style={{backgroundColor: shoe.color}}>
                                        <img src={shoe.image} alt={shoe.name} />
                                    </div>
                                    <div className="shoe-cart-right">
                                        <p className="shoe-cart-name">{shoe.name}</p>
                                        <div className="shoe-cart-price">{"$" + shoe.price}</div>
                                        <div className="action">
                                            <div className="amount">
                                                <div className="action-btn minus" onClick={() => decreaseAmount(shoe)}>-</div>
                                                <div className="num">{shoe.amount}</div>
                                                <div className="action-btn add" onClick={() => increaseAmount(shoe)}>+</div>
                                            </div>
                                            <div className="action-btn remove" onClick={() => removeFromCart(shoe)}>
                                                <img src={trash}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    {cart.length > 0 ? (
                        <div className="cart-payment" onClick={() => setGoToPayment(true)}>
                            <p className="payment-btn">CHECK OUT</p> 
                        </div> 
                    ) : (
                        <div style={{color: "white"}}>Your cart is empty.</div>) }
 
                </div>
            </div>
        </div>
    )
}

export default Cart;