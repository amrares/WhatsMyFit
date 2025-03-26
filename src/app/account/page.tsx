"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function Account() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    // Remove profilePicture from userData state
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        createdAt: ''
    });

    useEffect(() => {
        // Check authentication status on component mount
        const saved = localStorage.getItem('isAuthenticated');
        const storedUserData = localStorage.getItem('userData');
        if (saved && storedUserData) {
            setUserData(JSON.parse(storedUserData));
            setIsAuthenticated(true);
        }
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) {
            console.log('No file selected');
            return;
        }

        const file = e.target.files[0];
        console.log('Starting upload...', {
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            userEmail: userData.email
        });

        const formData = new FormData();
        formData.append('file', file);
        formData.append('email', userData.email);

        try {
            console.log('Sending request to /api/upload');
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            console.log('Response received:', response.status);
            const data = await response.json();
            console.log('Response data:', data);

            if (response.ok) {
                const newUserData = {
                    ...userData,
                    profilePicture: data.profilePicture
                };
                setUserData(newUserData);
                localStorage.setItem('userData', JSON.stringify(newUserData));
                console.log('Profile updated successfully');
            } else {
                console.error('Upload failed:', data.error);
            }
        } catch (error) {
            console.error('Upload error:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/signin';
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.ok) {
                setIsAuthenticated(true);
                const newUserData = {
                    username: data.user.username,
                    email: data.user.email,
                    createdAt: data.user.createdAt
                };
                setUserData(newUserData);
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userData', JSON.stringify(newUserData));
            } else {
                if (data.error === 'User not found' && !isSignUp) {
                    alert('Account not found. Let\'s create one for you!');
                    setIsSignUp(true);
                } else if (data.error === 'Invalid password') {
                    alert('Incorrect password. Please try again.');
                } else {
                    console.error(data.error);
                    alert(data.error || 'Authentication failed');
                }
            }
        } catch (error) {
            console.error('Authentication error:', error);
            alert('Authentication failed. Please try again.');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        // In the handleLogout function
        setUserData({
            username: '',
            email: '',
            createdAt: ''
        });
        setFormData({
            username: '',
            email: '',
            password: ''
        });
        // Clear localStorage
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userData');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Add this new function after handleInputChange
    const handleSaveChanges = async () => {
        try {
            const response = await fetch('/api/auth/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: userData.email,
                    username: userData.username
                })
            });

            const data = await response.json();
            if (response.ok) {
                // Update localStorage with new data
                localStorage.setItem('userData', JSON.stringify(userData));
                alert('Changes saved successfully!');
            } else {
                console.error(data.error);
                alert('Failed to save changes');
            }
        } catch (error) {
            console.error('Error saving changes:', error);
            alert('Error saving changes');
        }
    };

    const handleDeleteAccount = async () => {
        if (confirm('Are you sure you want to do this? This action is permanent and cannot be reversed')) {
            try {
                const response = await fetch('/api/auth/delete-account', {  // Updated path
                    method: 'DELETE',  // Changed to DELETE method
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: userData.email })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                handleLogout();
                alert('Account deleted successfully');
            } catch (error) {
                console.error('Error deleting account:', error);
                alert('Failed to delete account. Please try again later.');
            }
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#1C1C1C] text-white">
                {/* Auth Form */}
                <main className="flex flex-col items-center justify-center min-h-[80vh]">
                    <div className="bg-[#2C2C2C] p-8 rounded-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-6 text-center">
                            {isSignUp ? "Create Account" : "Welcome Back"}
                        </h2>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {isSignUp && (
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        placeholder="Choose a username"
                                        className="w-full bg-[#1C1C1C] border border-[#8753F3] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#8753F3]"
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="your.email@example.com"
                                    className="w-full bg-[#1C1C1C] border border-[#8753F3] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#8753F3]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="••••••••"
                                    className="w-full bg-[#1C1C1C] border border-[#8753F3] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#8753F3]"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-[#8753F3] text-white py-3 rounded-md hover:bg-[#9e53f3] transition-all hover:scale-102 duration-300 mt-6"
                            >
                                {isSignUp ? "Sign Up" : "Sign In"}
                            </button>
                        </form>
                        <div className="mt-4 text-center">
                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-[#8753F3] hover:text-[#9e53f3] hover:scale-102 transition-all duration-300"
                            >
                                {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1C1C1C] text-white">
            <main className="flex flex-col items-center justify-start pt-16 px-8">
                <div className="w-full max-w-3xl">
                    {/* Profile Header */}
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-8">
                            <div className="relative">
                                <Image
                                    src="/profile.svg"
                                    alt="Profile Picture"
                                    width={120}
                                    height={120}
                                    className="bg-[#8753F3] rounded-full p-4"
                                />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold mb-2">{userData.username}</h1>
                                <p className="text-gray-400">member since {new Date(userData.createdAt).getFullYear()}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors"
                        >
                            Log Out
                        </button>
                    </div>

                    {/* Account Settings */}
                    <div className="space-y-8">
                        <div className="bg-[#2C2C2C] p-6 rounded-lg">
                            <h2 className="text-xl font-bold mb-4">Account Settings</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={userData.email}
                                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                        className="w-full bg-[#1C1C1C] border border-[#8753F3] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#8753F3]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Username</label>
                                    <input
                                        type="text"
                                        value={userData.username}
                                        onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                                        className="w-full bg-[#1C1C1C] border border-[#8753F3] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#8753F3]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#2C2C2C] p-6 rounded-lg">
                            <h2 className="text-xl font-bold mb-4">Preferences</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span>Dark Mode</span>
                                    <div className="w-12 h-6 bg-[#8753F3] rounded-full relative cursor-pointer">
                                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Email Notifications</span>
                                    <div className="w-12 h-6 bg-[#8753F3] rounded-full relative cursor-pointer">
                                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={handleSaveChanges}
                                className="w-full bg-[#8753F3] text-white py-3 rounded-md hover:bg-[#b853f3] transition-colors"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition-colors"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}