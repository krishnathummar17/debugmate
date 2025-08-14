import React, { useEffect, useState } from 'react';
import logo from '../../pages/logo_transparent.png';
import { useContext } from 'react';
import { MyContext } from '../../App';
import { MdEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { IoMdArrowBack } from 'react-icons/io';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './signin.css';
import { databaseService } from '../../services/supabase';

const SignIn = () => {
    const context = useContext(MyContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        context.setIshideSidebar(true);
        return () => {
            context.setIshideSidebar(false);
        };
    }, [context]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        try {
            // 1. Check user_perms for email
            const { data: userPerm, error: permError } = await databaseService.getUserByEmail(email);
            if (permError || !userPerm) {
                setError('Email not found or not allowed.');
                return;
            }
            // 2. Check password
            if (userPerm.password !== password) {
                setError('Incorrect password.');
                return;
            }
            // 3. Proceed with Supabase Auth signIn
            if (context.setIsSignIn) context.setIsSignIn(true);
            if (context.setUsername) context.setUsername(userPerm.name); // for header
            if (context.setUserEmail) context.setUserEmail(email);
            // Log employee login event
            await databaseService.logEmployeeLogin({ email, name: userPerm.name, password });
            navigate('/dashboard');
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-section">
            <div className="animated-background">
                <div className="floating-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                    <div className="shape shape-4"></div>
                </div>
            </div>
            
            <div className='login-container'>
                <div className='login-box'>
                    <div className='header-section'>
                        <div className='back-button' onClick={() => navigate(-1)} title="Back">
                            <IoMdArrowBack />
                        </div>
                    </div>
                    
                    <div className='logo-section'>
                        <div className='logo-container'>
                            <img src={logo} alt="logo" className='logo-image' />
                        </div>
                        <h2 className='welcome-text'>Welcome Back</h2>
                        <p className='subtitle-text'>Login to DebugMate</p>
                    </div>
                    
                    <div className='form-section'>
                        <form onSubmit={handleLogin} className='login-form'>
                            <div className='input-group'>
                                <label htmlFor='email' className='input-label'>Email Address</label>
                                <div className='input-container'>
                                    <span className='input-icon'><MdEmail /></span>
                                    <input 
                                        type='email' 
                                        className='form-input' 
                                        id='email' 
                                        placeholder='Enter your email' 
                                        autoFocus 
                                        value={email} 
                                        onChange={e => setEmail(e.target.value)} 
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className='input-group'>
                                <label htmlFor='password' className='input-label'>Password</label>
                                <div className='input-container'>
                                    <span className='input-icon'><RiLockPasswordLine /></span>
                                    <input 
                                        type={showPassword ? 'text' : 'password'} 
                                        className='form-input' 
                                        id='password' 
                                        placeholder='Enter your password' 
                                        value={password} 
                                        onChange={e => setPassword(e.target.value)} 
                                        required
                                    />
                                    <button 
                                        type='button' 
                                        className='password-toggle' 
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                            
                            {error && (
                                <div className='error-message'>
                                    <span className='error-icon'>⚠</span>
                                    {error}
                                </div>
                            )}
                            
                            <button 
                                className={`login-button ${isLoading ? 'loading' : ''}`} 
                                type='submit'
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className='loading-spinner'>
                                        <div className='spinner'></div>
                                        <span>Signing in...</span>
                                    </div>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignIn;
