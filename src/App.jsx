// App.jsx
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/menu";
import { ShoppingCartIcon, MenuIcon, XIcon } from "@/components/icons";

const products = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: Math.floor(Math.random() * 100) + 1,
  icon: '📦', // Using emoji as icon for simplicity
}));

export default function App() {
  const [currentPage, setCurrentPage] = useState('Products');
  const [cart, setCart] = useState([]);
  const [requests, setRequests] = useState([]);

  const addToCart = (product, quantity) => {
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
      setCart(cart.map(item => 
        item.id === product.id ? {...item, quantity: item.quantity + quantity} : item
      ));
    } else {
      setCart([...cart, {...product, quantity}]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const completePurchase = () => {
    if (cart.length > 0) {
      setRequests([...requests, { date: new Date(), items: cart }]);
      setCart([]);
      alert('Purchase completed!');
    }
  };

  const cartSum = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const PageContent = {
    'Products': <ProductsPage products={products} addToCart={addToCart} cartCount={cartCount} />,
    'Cart': <CartPage cart={cart} removeFromCart={removeFromCart} completePurchase={completePurchase} cartSum={cartSum} />,
    'Requests': <RequestsPage requests={requests} />,
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My E-Commerce</h1>
        <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
      {PageContent[currentPage]}
    </div>
  );
}

function Navigation({ currentPage, setCurrentPage }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <Menu>
        <MenuTrigger><MenuIcon className="h-6 w-6" /></MenuTrigger>
        <MenuContent>
          {['Products', 'Cart', 'Requests'].map(page => (
            <MenuItem key={page} onClick={() => { setCurrentPage(page); setIsOpen(false); }}>
              {page}
            </MenuItem>
          ))}
        </MenuContent>
      </Menu>
    </div>
    <div className="hidden sm:flex space-x-4">
      {['Products', 'Cart', 'Requests'].map(page => (
        <Button key={page} variant={currentPage === page ? 'default' : 'outline'} onClick={() => setCurrentPage(page)}>
          {page}
        </Button>
      ))}
    </div>
  );
}

function ProductsPage({ products, addToCart, cartCount }) {
  return (
    <div>
      <h2 className="text-xl">Products</h2>
      <p>Cart: {cartCount} items</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-grow">
        <span className="text-4xl">{product.icon}</span>
      </CardHeader>
      <CardContent>
        <p>{product.name}</p>
        <p>${product.price}</p>
        <Input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
      </CardContent>
      <CardFooter>
        <Button onClick={() => onAddToCart(product, quantity)}>
          <ShoppingCartIcon className="mr-2 h-5 w-5" /> Add
        </Button>
      </CardFooter>
    </Card>
  );
}

function CartPage({ cart, removeFromCart, completePurchase, cartSum }) {
  return (
    <div>
      <h2 className="text-xl">Shopping Cart</h2>
      <table className="min-w-full">
        <thead>
          <tr>
            <th>Product</th><th>Price</th><th>Quantity</th><th>Total</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cart.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>${item.price}</td>
              <td>{item.quantity}</td>
              <td>${(item.price * item.quantity).toFixed(2)}</td>
              <td><Button variant="destructive" onClick={() => removeFromCart(item.id)}>Remove</Button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Total: ${cartSum.toFixed(2)}</p>
      <p>Total Products: {cart.reduce((acc, item) => acc + item.quantity, 0)}</p>
      <Button onClick={completePurchase}>Complete Purchase</Button>
    </div>
  );
}

function RequestsPage({ requests }) {
  return (
    <div>
      <h2 className="text-xl">Purchase Requests</h2>
      <table className="min-w-full">
        <thead>
          <tr><th>Date</th><th>Product</th><th>Price</th><th>Quantity</th><th>Total</th></tr>
        </thead>
        <tbody>
          {requests.map((request, idx) => request.items.map(item => (
            <tr key={idx + '-' + item.id}>
              <td>{idx === 0 ? request.date.toLocaleString() : ''}</td>
              <td>{item.name}</td>
              <td>${item.price}</td>
              <td>{item.quantity}</td>
              <td>${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          )))}
        </tbody>
        <tfoot>
          <tr>
            <td></td><td></td><td></td>
            <td>{requests.reduce((acc, r) => acc + r.items.reduce((sum, i) => sum + i.quantity, 0), 0)}</td>
            <td>${requests.reduce((acc, r) => acc + r.items.reduce((sum, i) => sum + i.price * i.quantity, 0), 0).toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}