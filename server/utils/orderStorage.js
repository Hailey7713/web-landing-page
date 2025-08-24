const fs = require('fs');
const path = require('path');

// Path to the orders JSON file
const ORDERS_FILE = path.join(__dirname, '../../data/orders.json');

// Ensure data directory exists
const dataDir = path.dirname(ORDERS_FILE);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize orders file if it doesn't exist
if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));
}

const saveOrder = (orderData) => {
    try {
        const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf-8'));
        const orderWithTimestamp = {
            ...orderData,
            id: `ORD-${Date.now()}`,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };
        
        orders.push(orderWithTimestamp);
        fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
        return { success: true, order: orderWithTimestamp };
    } catch (error) {
        console.error('Error saving order:', error);
        return { success: false, error: 'Failed to save order' };
    }
};

const getOrders = () => {
    try {
        const data = fs.readFileSync(ORDERS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading orders:', error);
        return [];
    }
};

module.exports = {
    saveOrder,
    getOrders
};
