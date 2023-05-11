import React from 'react';

import Link from 'next/link';

export default function ProductItem({ product, addToCartHandler }) {
    return (
        <div className='card'>
            <Link href={`/product/${product.slug}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.image} alt={product.name} className='rounded shadow' />
            </Link>
            <div className='flex flex-col items-center justify-center p-5'>
                <Link href={`/product/${product.slug}`}>
                    <h2 className='text-lg'>{product.name}</h2>
                </Link>
                <p className='mb-2'>{product.brand}</p>
                <p>${product.price}</p>
                <button className='primary-button' type='button' onClick={() => addToCartHandler(product)}>
                    Add to Cart
                </button>
            </div>
        </div>
    );
}
