import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Alert, Spinner } from 'react-bootstrap';
import { FaEye, FaCheckCircle, FaTruck, FaFileExport } from 'react-icons/fa';
import './AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/orders');
        const data = await response.json();
        if (data.success) {
          setOrders(data.orders);
        } else {
          setError('Failed to fetch orders');
        }
      } catch (err) {
        setError('Error connecting to server');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      processing: 'info',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const exportToCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer', 'Email', 'Phone', 'Total', 'Status'];
    const csvContent = [
      headers.join(','),
      ...orders.map(order => [
        `"${order.id}"`,
        `"${formatDate(order.timestamp)}"`,
        `"${order.customerName}"`,
        `"${order.email}"`,
        `"${order.phone}"`,
        `"$${order.totalAmount.toFixed(2)}"`,
        `"${order.status}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading orders...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Order Management</h2>
        <button 
          onClick={exportToCSV}
          className="btn btn-outline-primary"
        >
          <FaFileExport className="me-2" />
          Export to CSV
        </button>
      </div>

      {orders.length === 0 ? (
        <Alert variant="info">No orders found.</Alert>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{formatDate(order.timestamp)}</td>
                  <td>
                    <div>{order.customerName}</div>
                    <small className="text-muted">{order.email}</small>
                  </td>
                  <td>
                    {order.items?.slice(0, 2).map((item, idx) => (
                      <div key={idx}>
                        {item.name} × {item.quantity}
                      </div>
                    ))}
                    {order.items?.length > 2 && (
                      <div>+{order.items.length - 2} more items</div>
                    )}
                  </td>
                  <td>${order.totalAmount?.toFixed(2)}</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-outline-primary me-2"
                      title="View Details"
                      onClick={() => {/* Implement view details */}}
                    >
                      <FaEye />
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-success me-2"
                      title="Mark as Processed"
                      onClick={() => {/* Implement process order */}}
                    >
                      <FaCheckCircle />
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-info"
                      title="Mark as Shipped"
                      onClick={() => {/* Implement ship order */}}
                    >
                      <FaTruck />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default AdminOrders;
