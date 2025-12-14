import React from 'react'
import ProductCard from './ProductCard'
import { useAppContext } from '../context/AppContext'

const BestProduct = () => {
    const { products } = useAppContext();
  return (
    <div className='mt-16'>
        <p className='text-2xl md:text-2xl font-medium'>Best Products</p>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 sm:gap-3 md:gap-6 lg:grid-cols-5 mt-6'>
            {products.filter((product) => product.inStock).slice(0,5).map((product, index)=>(
                <ProductCard key={index} product={product}/>
            ))}
            
        </div>
    </div>
  )
}

export default BestProduct