import { useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import Product from '../models/Product';
import db from '../utils/db';
import { Store } from '../utils/Store';
import { CART_ADD_ITEM } from '../utils/constants';

export default function Home({ products }) {
    const { state, dispatch } = useContext(Store);
    const { cart } = state;

    const addToCartHandler = async (product) => {
        const existItem = cart.cartItems.find((x) => x.slug === product.slug);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`/api/products/${product._id}`);

        if (data.countInStock < quantity) {
            return toast.error('Out of stock');
        }

        dispatch({ type: CART_ADD_ITEM, payload: { ...product, quantity } });

        toast.success('Added to the cart');
    };
    return (
        <Layout title='Home Page'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:gird-cols-4'>
                {products.map((product) => (
                    <ProductItem product={product} key={product.slug} addToCartHandler={addToCartHandler}></ProductItem>
                ))}
            </div>
        </Layout>
    );
}

export async function getServerSideProps() {
    await db.connect();

    const products = await Product.find().lean();

    await db.disconnect();

    return {
        props: {
            products: products.map(db.convertToObj),
        },
    };
}
