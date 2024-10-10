CREATE DATABASE Nike_Shoes_DB;
USE Nike_Shoes_DB;

CREATE TABLE Shoes(
	id INT PRIMARY KEY,  
    image NVARCHAR(255),  
    name NVARCHAR(255),  
    description NVARCHAR(MAX),  
    price DECIMAL(10, 2),  
    color NVARCHAR(7)  
)

DECLARE @shoes NVARCHAR(MAX);  

-- Load the JSON file as a single string  
SET @shoes = (SELECT BulkColumn  
               FROM OPENROWSET(BULK 'C:\Users\Admin\Downloads\shoes.json', SINGLE_CLOB) AS j);  

-- Print the content of the @shoes variable (this is optional)  
--PRINT @shoes;  

-- Parse the JSON
INSERT INTO Shoes
SELECT *   
FROM OPENJSON(@shoes, '$.shoes') -- Access the 'shoes' array  
WITH  
(  
    id INT,  
    image NVARCHAR(255),  
    name NVARCHAR(255),  
    description NVARCHAR(MAX),  
    price DECIMAL(10, 2),  
    color NVARCHAR(7)  
);  


SELECT * FROM Shoes;

CREATE TABLE Customers (  
    CustomerID INT IDENTITY(1,1) PRIMARY KEY,  
    FullName NVARCHAR(100),  
    Phone NVARCHAR(20),  
    Address NVARCHAR(250),  
    City NVARCHAR(50),  
    Country NVARCHAR(50),  
);  

CREATE TABLE Orders (  
    OrderID INT IDENTITY(1,1) PRIMARY KEY,  
    CustomerID INT FOREIGN KEY REFERENCES Customers(CustomerID),  
    OrderDate DATETIME DEFAULT GETDATE(),  
    TotalAmount DECIMAL(10, 2),   
);  

CREATE TABLE OrderDetail (  
    OrderDetailID INT IDENTITY(1,1) PRIMARY KEY,  
    OrderID INT FOREIGN KEY REFERENCES Orders(OrderID),  
    ShoeID INT FOREIGN KEY REFERENCES Shoes(id),  
    Quantity INT,  
    Price DECIMAL(10, 2)  
); 

SELECT * FROM Customers;
SELECT * FROM Orders;
SELECT * FROM OrderDetail;

