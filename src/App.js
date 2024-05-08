import React from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from './Components/Layout/Layout'
import Home from './Components/Home/Home'
import About from './Components/About/About'
import AddProduct from './Components/AddProduct/AddProduct'
import Web from './Components/Web/Web'
import Mob from './Components/Mob/Mob'
import NotFound from './Components/NotFound/NotFound'
import Product from './Components/Product/Product'
import ProductDetail from './Components/ProductDetail/ProductDetail'
import ProductTimer from './Components/ProductTimer/ProductTimer'

export default function App() {
  let router = createBrowserRouter([
    {
      path: '', element: <Layout />, errorElement: <NotFound />, children: [
        { index: true, element: <Home /> },
        {
          path: 'about', element: <About />, children: [
            { index: true, element: <Web /> },
            { path: 'mob', element: <Mob /> },
          ]
        },
        { path: 'addproduct', element: <AddProduct /> },
        { path: 'product', element: <Product /> },
        {
          path: 'product/:productId', element: <ProductDetail />, children: [
            { path: 'timer', element: <ProductTimer /> } // Add the product timer route as a child
          ]
        },

      ]
    }
  ])
  return <RouterProvider router={router}></RouterProvider>
}
