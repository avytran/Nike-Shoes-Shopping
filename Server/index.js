const express = require('express');  
const { Connection, Request, TYPES } = require('tedious');  
const cors = require('cors');  
const port = 5000;  

const app = express();
app.use(express.json());  
app.use(cors());    

//Database information
const config = {  
    server: 'MSI\\MSSQLSERVER2022',  
    authentication: {  
        type: 'default',  
        options: {  
            userName: 'avy',  
            password: '12345678'  
        }  
    },  
    options: {  
        encrypt: false,  
        trustServerCertificate: true,  
        database: 'Nike_Shoes_DB'  
    }  
};

// Create a new connection  
const connection = new Connection(config);  

// Handle connection events  
connection.on('connect', err => {  
    if (err) {  
        console.error("Database connection failed: ", err);  
    } else {  
        console.log("Connected to the database");  
    }  
});  

// Connect to the database  
connection.connect(err => {  
    if (err) {  
        console.error('Connection failed: ', err);  
    }  
});  

//Execute a read query  
const executeReadQuery = (query) => {  
    return new Promise((resolve, reject) => {  
        const request = new Request(query, (err) => {  
            if (err) {   
                reject(err);  
            }  
        });  

        const result = [];   

        request.on('row', columns => {  
            const entry = columns.reduce((acc, column) => {  
                acc[column.metadata.colName] = column.value;  
                return acc;  
            }, {});  

            result.push(entry);  
        });  

        request.on('doneProc', () => {  
            resolve(result); 
        });  

        request.on('error', err => {  
            reject(err);  
        });  

        connection.execSql(request);  
    });  
} 

// Route to read shoes  
app.get('/read-shoes', (req, res) => {  
    const readQuery = `SELECT * FROM Shoes;`;  

    executeReadQuery(readQuery)  
        .then(shoes => {
            return res.json(shoes);
        })  
        .catch(err => res.send('Error executing SQL query: ' + err.message));  
});

//When the user checks out, the checkout information is saved in three tables: Customer, Orders, and OrderDetail.
//Route to add a new customer in Customer Table
app.post('/new-customer', (req, res) => {  
    const { name, phonenumber, address, country, city } = req.body;  

    // SQL query with parameter placeholders  
    const insertCustomerQuery = `  
        INSERT INTO Customers (Fullname, Phone, Address, City, Country)
        OUTPUT INSERTED.CustomerID   
        VALUES (@name, @phonenumber, @address, @city, @country);  
    `;  

    // Create a request and add parameters for the SQL query  
    const customerRequest = new Request(insertCustomerQuery, (err, rowCount) => {  
        if (err) {  
            console.error(err);   
        }    
    });  

    // Add parameters to the request  
    customerRequest.addParameter('name', TYPES.NVarChar, name);  
    customerRequest.addParameter('phonenumber', TYPES.NVarChar, phonenumber);  
    customerRequest.addParameter('address', TYPES.NVarChar, address);  
    customerRequest.addParameter('city', TYPES.NVarChar, city);  
    customerRequest.addParameter('country', TYPES.NVarChar, country);  

    
    // Execute the SQL request  
    connection.execSql(customerRequest);  

    let customerId;
    customerRequest.on('row', (columns) => {  
        columns.forEach((column) => {  
            if (column.metadata.colName === 'CustomerID') {  
                customerId = column.value;  
            }  
        }); 
    });  

    customerRequest.on('doneProc', () => {
        return res.json(customerId);
    })

});  
//Route to add a new order in Orders Table
app.post('/new-order', (req, res) => {
    const { customerId, totalPrice } = req.body;
    const insertOrderQuery = `  
    INSERT INTO Orders (CustomerID, TotalAmount)
    OUTPUT INSERTED.OrderID   
    VALUES (@customerId, @totalPrice);  `;  

    const orderRequest = new Request(insertOrderQuery, (err, rowCount) => {  
        if (err) {  
            console.error(err);  
        }    
    });  

    orderRequest.addParameter('customerId', TYPES.Int, customerId);  
    orderRequest.addParameter('totalPrice', TYPES.Decimal, totalPrice);

    connection.execSql(orderRequest);
    
    let orderId;
    orderRequest.on('row', (columns) => {  
        columns.forEach((column) => {  
            if (column.metadata.colName === 'OrderID') {  
                orderId = column.value;  
            }  
        }); 
    });  

    orderRequest.on('doneProc', () => {
        return res.json(orderId);
    })
    
})
//Route to add a new order-detail in OrderDetail Table
app.post('/new-order-detail', (req, res) => {
    const { orderId, cart } = req.body;

    const shoesId = cart.map(shoe => {
        return shoe.id;
    })

    const totalPrices = cart.map(shoe => {
        return shoe.price * shoe.amount
    })
 
    let insertOrderDetailQuery = `INSERT INTO OrderDetail (OrderId, ShoeID, Quantity, Price) VALUES`; 
    
    for (let i = 0; i < cart.length; i++) {
        if (i === cart.length - 1)
            insertOrderDetailQuery += `(@orderId, ${shoesId[i]}, ${cart[i].amount}, ${totalPrices[i]})`;
        else
            insertOrderDetailQuery += `(@orderId, ${shoesId[i]}, ${cart[i].amount}, ${totalPrices[i]}),`;
    }

    const orderDetailRequest = new Request(insertOrderDetailQuery, (err, rowCount) => {  
        if (err) {  
            console.error(err);  
        }    
    });  

    orderDetailRequest.addParameter('orderId', TYPES.Int, orderId);  
    connection.execSql(orderDetailRequest);
})

// Start the server  
app.listen(port, () => {  
    console.log(`Server is running at http://localhost:${port}`);  
});