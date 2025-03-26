"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handlePlusClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#1C1C1C] text-white">
      {/* Main Content */}
      <main className="flex flex-col items-center justify-center flex-grow mt-35">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <div
          onClick={handlePlusClick}
          className="w-[350px] h-[350px] border-5 border-dashed border-[#8753F3] rounded-full flex flex-col items-center justify-center cursor-pointer hover:bg-purple-500/10 transition-colors overflow-hidden"
        >
          {imagePreview ? (
            <Image
              src={imagePreview}
              alt="Uploaded clothing item"
              width={350}
              height={350}
              style={{ objectFit: 'contain' }}
            />
          ) : (
            <div className="font-sans text-[#8753F3] text-[200px]">+</div>
          )}
        </div>

        {/* Upload Button - Can be connected to functionality later */}
        <button className="mt-8 bg-[#8753F3] text-white px-8 py-3 rounded-full cursor-pointer hover:bg-[#b853f3] transition-colors duration-300">
          <p className="font-sans text-white text-lg font-bold">Add an item to your wardrobe</p>
        </button>
      </main>
    </div>
  );
}
