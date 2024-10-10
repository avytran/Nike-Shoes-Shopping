import './App.css';
import { useEffect, useState } from 'react';
import nikeLogo from './assets/white-logo-nike.png';
import checkIcon from './assets/check.png';
import trash from './assets/trash.png';
import Product from './components/Product/Product';
import Cart from './components/Cart/Cart';
import Payment from './components/Payment/Payment';

function App() {

  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0.00);
  const [goToPayment, setGoToPayment] = useState(false);
  
  return (
    <div className="App">
      <div className='wave-animation'></div>

      {
        goToPayment  
        ? (<Payment 
            cart={cart} 
            totalPrice={totalPrice} 
            setGoToPayment={setGoToPayment} 
            setCart={setCart}/>) 
        : null
      }
      
      <div className='container'>
        <Product
          cart={cart}
          setCart={setCart}
          nikeLogo={nikeLogo}
          checkIcon={checkIcon}
          setTotalPrice={setTotalPrice}
        />
        <Cart
          nikeLogo={nikeLogo}
          trash={trash}
          cart={cart}
          setCart={setCart}
          totalPrice={totalPrice}
          setTotalPrice={setTotalPrice}
          setGoToPayment={setGoToPayment}
        />
      </div>
  </div>
  );
}

export default App;
