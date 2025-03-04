import React, { useState } from "react";
import { X } from "lucide-react";

const TikTokPopup = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-gray-100 shadow-lg border border-gray-300 rounded-lg p-3 w-96 flex items-start relative">
      <span className="text-red-500 font-bold text-lg mr-2">‼️</span>
      <div className="flex-1">
        <p className="text-sm text-gray-800">
          You're agreeing to give <strong>TikTok full screen access</strong>{" "}
          among other precious data like <span className="blur-sm">the right to sell your data</span>.
        </p>
        <button className="mt-2 bg-green-500 text-white px-3 py-1 text-sm rounded">
          Learn More
        </button>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default TikTokPopup;