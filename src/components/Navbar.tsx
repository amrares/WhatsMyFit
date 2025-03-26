'use client'

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [profilePicture, setProfilePicture] = useState('/profile.svg');

    useEffect(() => {
        const userData = localStorage.getItem('userData');
        if (userData) {
            const parsedData = JSON.parse(userData);
            setProfilePicture(parsedData.profilePicture || '/profile.svg');
        }
    }, []);

    return (
        <nav className="flex justify-between items-center px-8 bg-[#1C1C1C]">
            <div className="flex items-center">
                <Link href="/">
                    <Image
                        src="/logo.png"
                        alt="WhatsMyFit Logo"
                        width={140}
                        height={140}
                        className="text-purple-500"
                    />
                </Link>
            </div>
            <div className="flex gap-16 items-center">
                <Link href="/" className="font-sans font-bold hover:text-purple-400 hover:scale-110 transition-all duration-300">
                    Home
                </Link>
                <Link href="/wardrobe" className="font-sans font-bold hover:text-purple-400 hover:scale-110 transition-all duration-">
                    My Wardrobe
                </Link>
                <Link href="/generator" className="font-sans font-bold hover:text-purple-400 hover:scale-110 transition-all duration-">
                    Outfit Generator
                </Link>
                <Link href="/account" className="font-sans font-bold hover:text-purple-400 hover:scale-110 transition-all duration-300">
                    <Image
                        src="/profile.svg"
                        alt="Profile Picture"
                        width={40}
                        height={40}
                    />
                </Link>
            </div>
        </nav>
    );
}