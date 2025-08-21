-- USERS
INSERT INTO users (id, name, email, password, enabled)
VALUES (1, 'Admin User', 'admin@example.com', '{noop}admin123', true);

INSERT INTO users (id, name, email, password, enabled)
VALUES (2, 'Normal User', 'user@example.com', '{noop}user123', true);

INSERT INTO users (id, name, email, password, enabled)
VALUES (3, 'Florist Applicant', 'florist@example.com', '{noop}florist123', true);

-- USER ROLES (assuming users_roles is the join table)
INSERT INTO users_roles (user_id, roles)
VALUES (1, 'ADMIN');
INSERT INTO users_roles (user_id, roles)
VALUES (2, 'USER');
INSERT INTO users_roles (user_id, roles)
VALUES (3, 'FLORIST_APPLICANT');

-- FLORIST APPLICATIONS
INSERT INTO florist_applications (id, florist_name, description, status, user_id)
VALUES (1, 'Rose Paradise', 'We sell fresh roses daily', 'PENDING', 3);

-- PRODUCTS
INSERT INTO products (id, name, description, category, price, quantity, florist_id)
VALUES (1, 'Red Roses 100g', 'Fresh red roses', 'Flowers', 150.00, 50, 3);

INSERT INTO products (id, name, description, category, price, quantity, florist_id)
VALUES (2, 'Tulip Bouquet', 'Colorful tulip bouquet', 'Bouquets', 250.00, 20, 3);

-- ORDERS
INSERT INTO orders (id, user_id, total_amount, status, razorpay_order_id)
VALUES (1, 2, 150.00, 'PAID', 'order_123');

-- ORDER_PRODUCTS (join table for order items)
INSERT INTO order_products (order_id, product_id, quantity)
VALUES (1, 1, 1);
