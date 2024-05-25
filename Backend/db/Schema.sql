CREATE DATABASE IF NOT EXISTS test_nodejs CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

use test_nodejs;

CREATE TABLE IF NOT EXISTS user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    gender VARCHAR(10),
    email VARCHAR(255) UNIQUE NOT NULL,
    user_role VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `address` (
    address_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    address_name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    province VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    amphoe VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    district VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    address_line1 VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    address_line2 VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    postal_code VARCHAR(20),
    country_name VARCHAR(100),
    tel_no VARCHAR(15),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);

CREATE TABLE IF NOT EXISTS payment_type (
    payment_type_id INT AUTO_INCREMENT PRIMARY KEY,
    payment_name VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_payment_method (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    payment_type_id INT,
    account_name VARCHAR(50) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    payment_expiry_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (payment_type_id) REFERENCES payment_type(payment_type_id)
);

CREATE TABLE IF NOT EXISTS category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    product_name VARCHAR(255) NOT NULL,
    product_description TEXT,
    product_image MEDIUMTEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE IF NOT EXISTS `order` (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    payment_type VARCHAR(50),
    account_number VARCHAR(50),
    address_name VARCHAR(255),
    province VARCHAR(100),
    district VARCHAR(100),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    postal_code VARCHAR(20),
    country_name VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);

CREATE TABLE IF NOT EXISTS order_item (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    product_name VARCHAR(255),
    product_image VARCHAR(255),
    discount DECIMAL(10, 2),
    price DECIMAL(10, 2) NOT NULL,
    order_status VARCHAR(50),
    qty INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES `order`(order_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);

CREATE TABLE IF NOT EXISTS shopping_cart_item (
    shopping_cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_item_id INT,
    qty INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (product_item_id) REFERENCES product(product_id)
);

CREATE TABLE IF NOT EXISTS Discount (
    discount_id INT AUTO_INCREMENT PRIMARY KEY,
    discount DECIMAL(10, 2) NOT NULL,
    min_price INT,
    max_discount INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS DiscountCategory (
    category_id INT,
    discount_id INT,
    PRIMARY KEY (category_id, discount_id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES category(category_id),
    FOREIGN KEY (discount_id) REFERENCES Discount(discount_id)
);

CREATE TABLE IF NOT EXISTS ProductCategory (
    product_id INT,
    category_id INT,
    PRIMARY KEY (product_id, category_id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES category(category_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);