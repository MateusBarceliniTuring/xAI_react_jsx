import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"

const icons = [
  '⌚️', '📱', '💻', '🪜', '🖥️', '🖨️', '🕹️', '💾', '📷', '⏰', '📡', '⌛️', '🔨', '🪚', '🔪', '🔭', '🪑', '🪣', '🔦', '📦'
];

const products = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: Math.floor(Math.random() * 100) + 10,
  icon: icons[i],
}));

function App() {
  const [activePage, setActivePage] = useState('Products');
  const [cart, setCart] = useState([]);
  const [requests, setRequests] = useState([]);

  const addToCart = (product) => {
    const inputElement = document.getElementById(`product-id-${product.id}`);
    const quantity = parseInt(inputElement.value);
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity }]);
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

  const cartSum = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const PageContent = () => {
    switch (activePage) {
      case 'Products':
        return (
          <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">Products</h1>
            <p className="text-sm">Cart Total: ${cartSum.toFixed(2)}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(product => (
                <Card key={product.id}>
                  <CardHeader>
                    <CardTitle className="flex">
                      <div className='mr-3'>{product.icon}</div>
                      <div>{product.name}</div>
                    </CardTitle>
                    <CardDescription>${product.price}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <Input id={"product-id-" + product.id} type="number" defaultValue={1} min={1} className="w-full mb-2" />
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => addToCart(product)}>
                      <div className="mr-3">🛒</div> Add
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        );
      case 'Cart':
        return (
          <div className="p-4">
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>${item.price}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                    <TableCell><a href="#" onClick={() => removeFromCart(item.id)} className="text-red-500">Remove</a></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 text-left">
              <div className="mt-5">
                <p>Total: ${cartSum.toFixed(2)}</p>
                <p>Total Items: {cart.reduce((acc, item) => acc + item.quantity, 0)}</p>
              </div>
              <Button className="mt-5" onClick={completePurchase}>Complete Purchase</Button>
            </div>
          </div>
        );
      case 'Requests':
        const sumQuantity = requests.reduce((accumulator, request) => {
          return accumulator + request.items.reduce((itemAccumulator, item) => {
            return itemAccumulator + item.quantity;
          }, 0);
        }, 0);

        const sumTotal = requests.reduce((accumulator, request) => {
          return accumulator + request.items.reduce((itemAccumulator, item) => {
            return itemAccumulator + (item.price * item.quantity);
          }, 0);
        }, 0);

        return (
          <div className="p-4">
            <h1 className="text-2xl font-bold">Purchase History</h1>
            <div className="mb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request, index) => (
                    request.items.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>{request.date.toLocaleString()}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>${item.price}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    ))
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableHead colSpan="3">Totals</TableHead>
                    <TableHead>{sumQuantity}</TableHead>
                    <TableHead>${sumTotal.toFixed(2)}</TableHead>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-between items-center p-4 bg-blue-500 text-white">
        <div className="text-xl">E-commerce App</div>
        <div className="hidden sm:block">
          {['Products', 'Cart', 'Requests'].map(page => (
            <Button
              key={page}
              variant={activePage === page ? 'default' : 'outline'}
              className={activePage === page ? 'mx-2' : 'mx-2 text-black'}
              onClick={() => setActivePage(page)}
            >
              {page}
            </Button>
          ))}
        </div>

        <Menubar className="sm:hidden">
          <MenubarMenu>
            <MenubarTrigger><div className="cursor-pointer text-black">☰</div></MenubarTrigger>
            <MenubarContent>
              {['Products', 'Cart', 'Requests'].map(page => (
                <MenubarItem key={page} onClick={() => setActivePage(page)}>{page}</MenubarItem>
              ))}
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
      <div className="flex-grow overflow-y-auto">
        <PageContent />
      </div>
    </div>
  );
}

export default App;