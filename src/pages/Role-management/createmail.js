import React, { useContext, useState, useEffect } from "react";
import { MyContext } from "../../App";
import { FaUser, FaCog, FaBell, FaShieldAlt, FaPalette, FaSignOutAlt, FaCode } from "react-icons/fa";
import { MdOutlineMenu } from "react-icons/md";
import "./setting.css";

const Setting = () => {
    const context = useContext(MyContext);
    const [activeSection, setActiveSection] = useState('profile');
    const [selectedColorTheme, setSelectedColorTheme] = useState('purple');
    const [selectedChatbotTheme, setSelectedChatbotTheme] = useState('default');
    const [selectedAccentColor, setSelectedAccentColor] = useState('purple');

    const handleProfileClick = () => {
        // Toggle the sidebar when profile is clicked
        if (context.setIstoggleSidebar) {
            context.setIstoggleSidebar(!context.istoggleSidebar);
        }
        setActiveSection('profile');
    };

    const handleColorThemeChange = (theme) => {
        setSelectedColorTheme(theme);
        // Apply color theme to the application
        document.documentElement.setAttribute('data-color-theme', theme);
        localStorage.setItem('colorTheme', theme);
    };

    const handleChatbotThemeChange = (theme) => {
        setSelectedChatbotTheme(theme);
        // Apply chatbot theme
        document.documentElement.setAttribute('data-chatbot-theme', theme);
        localStorage.setItem('chatbotTheme', theme);
    };

    const handleAccentColorChange = (color) => {
        setSelectedAccentColor(color);
        // Apply accent color
        document.documentElement.setAttribute('data-accent-color', color);
        localStorage.setItem('accentColor', color);
    };

    // Load saved themes on component mount
    useEffect(() => {
        const savedColorTheme = localStorage.getItem('colorTheme') || 'purple';
        const savedChatbotTheme = localStorage.getItem('chatbotTheme') || 'default';
        const savedAccentColor = localStorage.getItem('accentColor') || 'purple';

        setSelectedColorTheme(savedColorTheme);
        setSelectedChatbotTheme(savedChatbotTheme);
        setSelectedAccentColor(savedAccentColor);

        // Apply saved themes
        document.documentElement.setAttribute('data-color-theme', savedColorTheme);
        document.documentElement.setAttribute('data-chatbot-theme', savedChatbotTheme);
        document.documentElement.setAttribute('data-accent-color', savedAccentColor);
    }, []);

    const settingsSections = [
        {
            id: 'profile',
            title: 'Profile Settings',
            icon: <FaUser />,
            description: 'Manage your profile information and preferences'
        },
        {
            id: 'general',
            title: 'General Settings',
            icon: <FaCog />,
            description: 'Configure general application settings'
        },
        {
            id: 'notifications',
            title: 'Notifications',
            icon: <FaBell />,
            description: 'Manage notification preferences'
        },
        {
            id: 'security',
            title: 'Security',
            icon: <FaShieldAlt />,
            description: 'Security and privacy settings'
        },
        {
            id: 'appearance',
            title: 'Appearance',
            icon: <FaPalette />,
            description: 'Customize the look and feel'
        },
        {
            id: 'api-management',
            title: 'API Management',
            icon: <FaCode />,
            description: 'Manage API keys and endpoints'
        }
    ];

    const renderProfileSection = () => (
        <div className="profile-section">
            <div className="profile-header">
                <h2>Profile Information</h2>
                <p>Manage your account details and preferences</p>
            </div>
            
            <div className="profile-content">
                <div className="profile-avatar">
                    <div className="avatar-placeholder">
                        <FaUser />
                    </div>
                    <button className="change-avatar-btn">Change Avatar</button>
                </div>
                
                <div className="profile-form">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input 
                            type="text" 
                            placeholder="Enter your full name"
                            defaultValue={context.username || ''}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            placeholder="Enter your email"
                            defaultValue={context.userEmail || ''}
                            readOnly
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Role</label>
                        <input 
                            type="text" 
                            placeholder="Your role in the organization"
                            defaultValue="Developer"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Bio</label>
                        <textarea 
                            placeholder="Tell us about yourself..."
                            rows="4"
                        ></textarea>
                    </div>
                    
                    <div className="form-actions">
                        <button className="save-btn">Save Changes</button>
                        <button className="cancel-btn">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderGeneralSection = () => (
        <div className="general-section">
            <h2>General Settings</h2>
            <div className="settings-group">
                <div className="setting-item">
                    <div className="setting-info">
                        <h3>Language</h3>
                        <p>Choose your preferred language</p>
                    </div>
                    <select className="setting-control">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                    </select>
                </div>
                
                <div className="setting-item">
                    <div className="setting-info">
                        <h3>Time Zone</h3>
                        <p>Set your local time zone</p>
                    </div>
                    <select className="setting-control">
                        <option>UTC (00:00)</option>
                        <option>EST (-05:00)</option>
                        <option>PST (-08:00)</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderNotificationsSection = () => (
        <div className="notifications-section">
            <h2>Notification Preferences</h2>
            <div className="settings-group">
                <div className="setting-item">
                    <div className="setting-info">
                        <h3>Email Notifications</h3>
                        <p>Receive notifications via email</p>
                    </div>
                    <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                    </label>
                </div>
                
                <div className="setting-item">
                    <div className="setting-info">
                        <h3>Push Notifications</h3>
                        <p>Receive push notifications</p>
                    </div>
                    <label className="toggle-switch">
                        <input type="checkbox" />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>
        </div>
    );

    const renderSecuritySection = () => (
        <div className="security-section">
            <h2>Security Settings</h2>
            <div className="settings-group">
                <div className="setting-item">
                    <div className="setting-info">
                        <h3>Two-Factor Authentication</h3>
                        <p>Add an extra layer of security</p>
                    </div>
                    <button className="enable-btn">Enable</button>
                </div>
                
                <div className="setting-item">
                    <div className="setting-info">
                        <h3>Change Password</h3>
                        <p>Update your account password</p>
                    </div>
                    <button className="change-btn">Change</button>
                </div>
            </div>
        </div>
    );

    const renderAppearanceSection = () => (
        <div className="appearance-section">
            <h2>Appearance Settings</h2>
            <div className="settings-group">
                <div className="setting-item">
                    <div className="setting-info">
                        <h3>Theme Mode</h3>
                        <p>Choose your preferred theme mode</p>
                    </div>
                    <div className="theme-options">
                        <button 
                            className={`theme-btn ${context.istheme ? 'active' : ''}`}
                            onClick={() => context.setIstheme(true)}
                        >
                            Light
                        </button>
                        <button 
                            className={`theme-btn ${!context.istheme ? 'active' : ''}`}
                            onClick={() => context.setIstheme(false)}
                        >
                            Dark
                        </button>
                    </div>
                </div>
                
                <div className="setting-item">
                    <div className="setting-info">
                        <h3>Primary Color Theme</h3>
                        <p>Choose your preferred color scheme</p>
                    </div>
                    <div className="color-theme-options">
                        <button 
                            className={`color-btn purple-theme ${selectedColorTheme === 'purple' ? 'active' : ''}`}
                            onClick={() => handleColorThemeChange('purple')}
                        >
                            <span className="color-preview purple"></span>
                            <span className="color-name">Purple</span>
                        </button>
                        <button 
                            className={`color-btn blue-theme ${selectedColorTheme === 'blue' ? 'active' : ''}`}
                            onClick={() => handleColorThemeChange('blue')}
                        >
                            <span className="color-preview blue"></span>
                            <span className="color-name">Blue</span>
                        </button>
                        <button 
                            className={`color-btn green-theme ${selectedColorTheme === 'green' ? 'active' : ''}`}
                            onClick={() => handleColorThemeChange('green')}
                        >
                            <span className="color-preview green"></span>
                            <span className="color-name">Green</span>
                        </button>
                        <button 
                            className={`color-btn orange-theme ${selectedColorTheme === 'orange' ? 'active' : ''}`}
                            onClick={() => handleColorThemeChange('orange')}
                        >
                            <span className="color-preview orange"></span>
                            <span className="color-name">Orange</span>
                        </button>
                        <button 
                            className={`color-btn pink-theme ${selectedColorTheme === 'pink' ? 'active' : ''}`}
                            onClick={() => handleColorThemeChange('pink')}
                        >
                            <span className="color-preview pink"></span>
                            <span className="color-name">Pink</span>
                        </button>
                        <button 
                            className={`color-btn teal-theme ${selectedColorTheme === 'teal' ? 'active' : ''}`}
                            onClick={() => handleColorThemeChange('teal')}
                        >
                            <span className="color-preview teal"></span>
                            <span className="color-name">Teal</span>
                        </button>
                    </div>
                </div>
                
                <div className="setting-item">
                    <div className="setting-info">
                        <h3>Chatbot Color Theme</h3>
                        <p>Customize chatbot interface colors</p>
                    </div>
                    <div className="chatbot-color-options">
                        <button 
                            className={`chatbot-color-btn default-theme ${selectedChatbotTheme === 'default' ? 'active' : ''}`}
                            onClick={() => handleChatbotThemeChange('default')}
                        >
                            <span className="chatbot-preview default"></span>
                            <span className="theme-name">Default</span>
                        </button>
                        <button 
                            className={`chatbot-color-btn modern-theme ${selectedChatbotTheme === 'modern' ? 'active' : ''}`}
                            onClick={() => handleChatbotThemeChange('modern')}
                        >
                            <span className="chatbot-preview modern"></span>
                            <span className="theme-name">Modern</span>
                        </button>
                        <button 
                            className={`chatbot-color-btn warm-theme ${selectedChatbotTheme === 'warm' ? 'active' : ''}`}
                            onClick={() => handleChatbotThemeChange('warm')}
                        >
                            <span className="chatbot-preview warm"></span>
                            <span className="theme-name">Warm</span>
                        </button>
                        <button 
                            className={`chatbot-color-btn cool-theme ${selectedChatbotTheme === 'cool' ? 'active' : ''}`}
                            onClick={() => handleChatbotThemeChange('cool')}
                        >
                            <span className="chatbot-preview cool"></span>
                            <span className="theme-name">Cool</span>
                        </button>
                    </div>
                </div>
                
                <div className="setting-item">
                    <div className="setting-info">
                        <h3>Accent Color</h3>
                        <p>Choose accent color for highlights and buttons</p>
                    </div>
                    <div className="accent-color-options">
                        <button 
                            className={`accent-btn accent-purple ${selectedAccentColor === 'purple' ? 'active' : ''}`}
                            onClick={() => handleAccentColorChange('purple')}
                        >
                            <span className="accent-preview purple"></span>
                            <span className="accent-name">Purple</span>
                        </button>
                        <button 
                            className={`accent-btn accent-blue ${selectedAccentColor === 'blue' ? 'active' : ''}`}
                            onClick={() => handleAccentColorChange('blue')}
                        >
                            <span className="accent-preview blue"></span>
                            <span className="accent-name">Blue</span>
                        </button>
                        <button 
                            className={`accent-btn accent-green ${selectedAccentColor === 'green' ? 'active' : ''}`}
                            onClick={() => handleAccentColorChange('green')}
                        >
                            <span className="accent-preview green"></span>
                            <span className="accent-name">Green</span>
                        </button>
                        <button 
                            className={`accent-btn accent-orange ${selectedAccentColor === 'orange' ? 'active' : ''}`}
                            onClick={() => handleAccentColorChange('orange')}
                        >
                            <span className="accent-preview orange"></span>
                            <span className="accent-name">Orange</span>
                        </button>
                        <button 
                            className={`accent-btn accent-pink ${selectedAccentColor === 'pink' ? 'active' : ''}`}
                            onClick={() => handleAccentColorChange('pink')}
                        >
                            <span className="accent-preview pink"></span>
                            <span className="accent-name">Pink</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderApiManagementSection = () => (
        <div className="api-management-section">
            <h2>Chatbot API Management</h2>
            <p className="section-description">Manage your chatbot API keys, models, and conversation settings</p>
            
            <div className="settings-group">
                <div className="setting-item">
                    <div className="setting-info">
                        <h3>Chatbot API Keys</h3>
                        <p>Manage API keys for chatbot services (OpenAI, Claude, etc.)</p>
                    </div>
                    <button className="manage-btn">Manage Keys</button>
                </div>
                
                <div className="setting-item">
                    <div className="setting-info">
                        <h3>AI Model Selection</h3>
                        <p>Choose your preferred AI model for chatbot responses</p>
                    </div>
                    <select className="setting-control">
                        <option>GPT-4</option>
                        <option>GPT-3.5 Turbo</option>
                        <option>Claude-3</option>
                        <option>Claude-2</option>
                        <option>Custom Model</option>
                    </select>
                </div>
                
                <div className="setting-item">
                    <div className="setting-info">
                        <h3>Conversation Memory</h3>
                        <p>Enable conversation history and context retention</p>
                    </div>
                    <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                    </label>
                </div>
                
                <div className="setting-item">
                    <div className="setting-info">
                        <h3>Response Length</h3>
                        <p>Set maximum response length for chatbot</p>
                    </div>
                    <select className="setting-control">
                        <option>Short (100-200 words)</option>
                        <option>Medium (200-500 words)</option>
                        <option>Long (500+ words)</option>
                        <option>Custom</option>
                    </select>
                </div>
                
                <div className="setting-item">
                    <div className="setting-info">
                        <h3>Temperature Settings</h3>
                        <p>Control creativity vs consistency in responses</p>
                    </div>
                    <select className="setting-control">
                        <option>Conservative (0.1)</option>
                        <option>Balanced (0.5)</option>
                        <option>Creative (0.9)</option>
                        <option>Custom</option>
                    </select>
                </div>
                
                <div className="setting-item">
                    <div className="setting-info">
                        <h3>Chatbot Personality</h3>
                        <p>Configure chatbot's tone and personality</p>
                    </div>
                    <button className="configure-btn">Configure</button>
                </div>
                
                <div className="setting-item">
                    <div className="setting-info">
                        <h3>Rate Limiting</h3>
                        <p>Set API rate limits for chatbot requests</p>
                    </div>
                    <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                    </label>
                </div>
                
                <div className="setting-item">
                    <div className="setting-info">
                        <h3>Webhook Integration</h3>
                        <p>Setup webhooks for chatbot events and notifications</p>
                    </div>
                    <button className="setup-btn">Setup Webhooks</button>
                </div>
                
                <div className="setting-item">
                    <div className="setting-info">
                        <h3>Chatbot Analytics</h3>
                        <p>View conversation analytics and performance metrics</p>
                    </div>
                    <button className="analytics-btn">View Analytics</button>
                </div>
                
                <div className="setting-item">
                    <div className="setting-info">
                        <h3>API Documentation</h3>
                        <p>Access chatbot API documentation and integration guides</p>
                    </div>
                    <button className="docs-btn">View Docs</button>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch(activeSection) {
            case 'profile':
                return renderProfileSection();
            case 'general':
                return renderGeneralSection();
            case 'notifications':
                return renderNotificationsSection();
            case 'security':
                return renderSecuritySection();
            case 'appearance':
                return renderAppearanceSection();
            case 'api-management':
                return renderApiManagementSection();
            default:
                return renderProfileSection();
        }
    };

    return (
        <div className="settings-container">
            <div className="settings-header">
                <h1>Settings</h1>
                <p>Manage your account settings and preferences</p>
            </div>
            
            <div className="settings-layout">
                <div className="settings-sidebar">
                    <div className="sidebar-header">
                        <button 
                            className="menu-toggle"
                            onClick={() => context.setIstoggleSidebar(!context.istoggleSidebar)}
                        >
                            <MdOutlineMenu />
                        </button>
                        <span>Settings Menu</span>
                    </div>
                    
                    <div className="sidebar-menu">
                        {settingsSections.map((section) => (
                            <button
                                key={section.id}
                                className={`menu-item ${activeSection === section.id ? 'active' : ''}`}
                                onClick={() => {
                                    if (section.id === 'profile') {
                                        handleProfileClick();
                                    } else {
                                        setActiveSection(section.id);
                                    }
                                }}
                            >
                                <span className="menu-icon">{section.icon}</span>
                                <div className="menu-content">
                                    <span className="menu-title">{section.title}</span>
                                    <span className="menu-description">{section.description}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="settings-content">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Setting;
