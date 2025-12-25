import React from 'react';
import toast from 'react-hot-toast';
import { FaWhatsapp } from 'react-icons/fa';
import {   FacebookShareButton,   TelegramShareButton,   TwitterShareButton,   WhatsappShareButton, } from 'react-share'; 
const Share = ({ setShareModel, image, title, url }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 w-full max-w-md">
        {/* Header with close button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Share</h2>
          <button
            className="text-black text-2xl"
            onClick={() => setShareModel(false)}
            aria-label="Close Modal"
          >
            ×
          </button>
        </div>

        {/* Image */}
        {image && (
          <div className="mb-4">
            <img src={image} alt={title} className="w-full rounded-lg" />
          </div>
        )}

        {/* Project title and description */}
        <div className="mb-4">
          <p className="text-gray-800 font-medium">
            Sri Sai Shakthi Nagar (Poondi Project)
          </p>
          <p className="text-gray-500">
            big name next line and then dfhasjhaurhga
          </p>
        </div>

        {/* URL with copy button */}
        <div className="flex mb-6">
          <input
            type="text"
            value={url || "https://srisairam.co.in/"}
            readOnly
            className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 bg-gray-100 text-gray-700 text-sm"
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-r-md text-sm"
            onClick={() => {
              // Parse the URL to ensure it's properly formatted
              try {
                // Extract the pathname from the URL
                const urlObj = new URL(url);
                const path = urlObj.pathname;

                // Split path by "/" and encode each part individually
                const parts = path.split("/").filter((part) => part !== "");
                const encodedParts = parts.map((part) =>
                  encodeURIComponent(part)
                );

                // Reconstruct the URL with encoded path components
                const formattedUrl = `${urlObj.origin}/${encodedParts.join(
                  "/"
                )}${urlObj.search}${urlObj.hash}`;

                // Copy to clipboard
                navigator.clipboard.writeText(formattedUrl);
                toast.success("Copied");
              } catch (e) {
                // If URL parsing fails, fall back to simple encoding
                const formattedUrl = encodeURI(url);
                navigator.clipboard.writeText(formattedUrl);
                toast.success("Copied");
              }
            }}
          >
            Copy
          </button>
        </div>
        {/* Social share buttons */}
        <div className="flex justify-between">
          <WhatsappShareButton url={encodeURI(url)}>
            <div className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-4 rounded-lg shadow-md transition">
              {" "}
              <FaWhatsapp className="text-lg" />{" "}
            </div>
          </WhatsappShareButton>

          <FacebookShareButton url={encodeURI(url)}>
            <button className="bg-blue-600 rounded-lg p-3">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
              </svg>
            </button>
          </FacebookShareButton>

          <TwitterShareButton url={encodeURI(url)}>
            <button className="bg-black rounded-lg p-3">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>
          </TwitterShareButton>
          <TelegramShareButton url={encodeURI(url)}>
            <button className="bg-blue-400 rounded-lg p-3">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
              </svg>
            </button>
          </TelegramShareButton>
        </div>
      </div>
    </div>
  );
};

export default Share;