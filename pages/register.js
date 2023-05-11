import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';

import Layout from '../components/Layout';
import { getError } from '../utils/error';

export default function RegisterScreen() {
    const { data: session } = useSession();
    const router = useRouter();
    const { redirect } = router.query;

    useEffect(() => {
        if (session?.user) {
            router.push(redirect || '/');
        }
    }, [redirect, router, session]);

    const {
        handleSubmit,
        register,
        getValues,
        formState: { errors },
    } = useForm();

    const submitHandler = async ({ name, email, password }) => {
        try {
            await axios.post('/api/auth/signup', {
                name,
                email,
                password,
            });

            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (result.error) toast.error(result.error);
        } catch (err) {
            toast.error(getError(err));
        }
    };

    return (
        <Layout title='Register'>
            <form className='mx-auto max-w-screen-md' onSubmit={handleSubmit(submitHandler)}>
                <h1 className='mb-4 text-xl'>Register</h1>

                <div className='mb-4'>
                    <label htmlFor='name'>Name</label>
                    <input
                        type='name'
                        className='w-full'
                        id='name'
                        autoFocus
                        {...register('name', {
                            required: 'Enter name',
                        })}
                    />
                    {errors.name && <div className='text-red-500'>{errors.name.message}</div>}
                </div>

                <div className='mb-4'>
                    <label htmlFor='email'>Email</label>
                    <input
                        type='email'
                        className='w-full'
                        id='email'
                        {...register('email', {
                            required: 'Enter email',
                            pattern: {
                                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                                message: 'Invalid email',
                            },
                        })}
                    ></input>
                    {errors.email && <div className='text-red-500'>{errors.email.message}</div>}
                </div>

                <div className='mb-4'>
                    <label htmlFor='password'>Password</label>
                    <input
                        type='password'
                        className='w-full'
                        id='password'
                        {...register('password', {
                            required: 'Enter password',
                            minLength: { value: 5, message: 'Password must have more than 4 characters' },
                            validate: (val) => val.trim().length > 4,
                        })}
                    ></input>
                    {errors.password && <div className='text-red-500'>{errors.password.message}</div>}
                    {errors.password && errors.password.type === 'validate' && <div className='text-red-500'>Invalid password</div>}
                </div>

                <div className='mb-4'>
                    <label htmlFor='confirmPassword'>Confirm password</label>
                    <input
                        type='password'
                        className='w-full'
                        id='confirmPassword'
                        {...register('confirmPassword', {
                            required: 'Enter confirm password',
                            validate: (val) => val === getValues('password'),
                        })}
                    ></input>
                    {errors.password && <div className='text-red-500'>{errors.password.message}</div>}
                    {errors.confirmPassword && errors.confirmPassword.type === 'validate' && (
                        <div className='text-red-500'>Password do not match</div>
                    )}
                </div>

                <div className='mb-4'>
                    <button className='primary-button'>Register</button>
                </div>
                <div className='mb-4'>
                    Don&apos;t have an account? <Link href='/regiser'>Register</Link>
                </div>
            </form>
        </Layout>
    );
}
