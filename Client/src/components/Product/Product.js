import { useEffect, useState } from "react";
import './Product.css';
import {getShoes} from '../../api/api'

function Product ({ cart, setCart, nikeLogo, checkIcon, setTotalPrice}) {

    const [shoes, setShoes] = useState([]);

    useEffect( () => {
        const fetchShoes = async () => {  
        try {  
            const response = await getShoes();  
            setShoes(response.data);
            console.log(shoes);
            
        } catch (error) {  
            console.error('Error fetching tasks:', error);  
        };
        }; 

        fetchShoes();
    }, [])

    useEffect( () => {
        handleShoesInCart();
      }, [cart])
    
    const handleShoesInCart = () => {
        shoes.forEach((shoe) => {
          const isInCart = cart.some(item => {
            return item.id === shoe.id;
          });
          const shoeElement = document.querySelector('#shoe' + shoe.id);
          const addedBtn =  shoeElement.querySelector('.shoe-added');
          if(!isInCart && addedBtn != null){
            const checkBtn = addedBtn.querySelector('img');
            addedBtn.removeChild(checkBtn);
            addedBtn.classList.remove('shoe-added');
            addedBtn.classList.add('shoe-add-btn');
            addedBtn.innerText = 'ADD TO CART';
          }
        })
    }

    const addToCart = (shoe) => {  
        shoe.amount = 1;
        setCart(prevCart => {  
            if (!prevCart.includes(shoe)) {  
                return [...prevCart, shoe];  
            }  
            return prevCart; 
        });  
    
        setTotalPrice(prev => prev + shoe.price);
      }; 

    const handleAddBtn = (shoe) => {
        const isAdded = cart.includes(shoe);
        const shoeElement = document.querySelector('#shoe' + shoe.id);
        const addedBtn =  shoeElement.querySelector('.shoe-add-btn');

        if (!isAdded && addedBtn.className !== "shoe-added"){
            addToCart(shoe);
            const checkBtn = document.createElement('img');
            checkBtn.src = checkIcon;
            addedBtn.classList.remove('shoe-add-btn');
            addedBtn.classList.add('shoe-added');
            addedBtn.innerText = '';
            addedBtn.appendChild(checkBtn);
        }
    }

    return (
        <div className="product-section">
            <div className="card">
                <div className="card-corner"></div>
                <div className="logo-container">
                    <img className= "logo-nike" src={nikeLogo} />
                    <div className="card-header">Our Products</div>
                </div>
                <div className="shoe-elements">
                    {
                        shoes.map((shoe) => 
                            (
                                <div key={"shoe-" + shoe.id} className="shoe-element" id={"shoe" + shoe.id}>
                                    <div className="shoe-img-container" style={{backgroundColor: shoe.color}}>
                                        <img src={shoe.image} alt={shoe.name} />
                                    </div>
                                    <h3 className="shoe-name">{shoe.name}</h3>
                                    <div className="shoe-desc">{shoe.desc}</div>
                                    <div className="shoe-bottom">
                                        <div className="shoe-price">
                                            {"$" + shoe.price}
                                        </div>
                                        <div className="shoe-add-container">
                                            <p className="shoe-add-btn" onClick={() => handleAddBtn(shoe)}>
                                                ADD TO CART
                                            </p>
                                        </div>
                                    </div>
                                </div>  
                            )
                        )
                    }
                </div>
            </div>    
        </div>
    )
}

export default Product;