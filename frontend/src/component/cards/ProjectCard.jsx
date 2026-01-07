import React, { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaHome,
  FaMap,
  FaShareAlt,
  FaHeart,
} from "react-icons/fa";
import { BiBed } from "react-icons/bi";
import { useSelector } from "react-redux";
import API from "../../utils/API";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Share from "../models/Share";
import stickerImage from "../../assets/Star 6.png";
import sold from "../../assets/sold.png";

const ProjectCard = ({ product, viewMode = "list" }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const navigate = useNavigate();
  const [shareModel, setShareModel] = useState(false);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchWishlistStatus = async () => {
      try {
        const response = await API.get(`/wishlist/getWishlist`, {
          params: {
            userId: user?._id, // Fixed: added optional chaining
            listingId: product._id,
          },
        });
        setIsInWishlist(response.data.isInWishlist);
      } catch (error) {
        console.error("Failed to fetch wishlist status", error);
      }
    };

    if (user?._id && product._id) {
      fetchWishlistStatus();
    }
  }, [user, product._id]); // Fixed: added dependencies

  const handleWishlistToggle = async () => {
    if (!user?._id) {
      toast.error("Please login to add to wishlist");
      return;
    }

    try {
      const response = await API.post(`/wishlist/postWishlist`, {
        userId: user._id,
        listingId: product._id,
      });
      if (response.data.success) {
        setIsInWishlist(!isInWishlist);
        toast.success("Wishlist updated");
      }
    } catch (error) {
      console.error("Failed to update wishlist", error);
      toast.error("Failed to update wishlist");
    }
  };

  const handleCardClick = () => {
    navigate(
      `/projectDetail/${encodeURIComponent(product.title)}/${product._id}`,
      {
        state: product,
      }
    );
  };

  // Get thumbnail URL - it's an object with url property in schema
  const thumbnailUrl = product.thumbnail?.url || product.thumbnail || "";

  // Get description safely
  const description = product.description || "No description available";

  // Get price safely and format it
  const price = product.price
    ? Number(product.price).toLocaleString("en-IN")
    : "Price not available";

  // Get location title
  const locationTitle = product.locationTitle || "Location not specified";

  // Get total area
  const totalArea = product.totalArea || 0;

  // Get unit
  const unit = product.unit || "";

  // Get BHK
  const bhk = product.bhk || "";

  // Get balcony and terrace
  const hasBalcony = product.balcony || false;
  const hasTerrace = product.terrace || false;

  // Get category
  const category = product.category || "";

  // Get status
  const status = product.status || "available";

  return (
    <div
      className={`border shadow-lg p-4 bg-white relative hover:cursor-pointer ${
        viewMode === "list"
          ? "flex flex-col md:flex-row md:gap-4 gap-2 items-stretch"
          : "flex flex-col h-full"
      }`}
    >
      {/* Sticker - same for both views */}
      {status !== "sold-out" ? (
        <div className="absolute -top-6 -left-6 z-10 w-20 h-20 flex items-center justify-center">
          <img
            src={stickerImage}
            alt="Sticker"
            className="w-full h-full absolute top-0 left-0"
          />
          <div className="relative z-20 text-center -rotate-[35deg]">
            <div className="text-xs font-bold text-black">New</div>
            <div className="text-xs font-bold text-black">Arrival</div>
          </div>
        </div>
      ) : (
        <div className="absolute -top-6 -left-6 z-10 w-20 h-20 flex items-center justify-center">
          <img
            src={sold}
            alt="Sold"
            className="w-full h-full absolute top-0 left-0"
          />
        </div>
      )}

      {/* Share Modal - same for both views */}
      {shareModel && (
        <Share
          image={thumbnailUrl}
          title={product.title}
          url={`https://srisairam.co.in/projectDetail/${encodeURIComponent(
            product.title
          )}/${product._id}`}
          setShareModel={setShareModel}
        />
      )}

      {/* Thumbnail with conditional styling based on view mode */}
      {/* Thumbnail with conditional styling based on view mode */}
      <div
        className={
          viewMode === "list"
            ? "w-full md:max-w-[30%] md:min-w-[30%] flex"
            : "w-full"
        }
        onClick={handleCardClick}
      >
        <div
          className={`
      w-full bg-gray-100 overflow-hidden relative
      ${viewMode === "grid" ? "mb-2" : ""}
      ${viewMode === "list" ? "h-full" : "aspect-[4/3]"}
    `}
        >
          {thumbnailUrl ? (
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={thumbnailUrl}
                alt={product.title}
                className="max-w-full max-h-full object-contain"
                style={{
                  width: "auto",
                  height: "auto",
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FaHome className="text-gray-400 text-4xl" />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        className="flex flex-col gap-1 flex-grow min-h-0"
        onClick={handleCardClick}
      >
        <h2 className="text-xl font-bold flex items-center gap-2 font-[Montserrat]">
          <FaHome /> {product.title || "Untitled Property"}
        </h2>
        <p className="flex items-center gap-2 font-[Montserrat]">
          <FaMapMarkerAlt /> {locationTitle}
        </p>
        {unit && totalArea > 0 && (
          <p className="flex items-center gap-2 font-[Montserrat]">
            <FaMap />
            {unit === "sqft"
              ? `${totalArea} Sq.ft `
              : unit === "Acre"
              ? `${totalArea} Acre`
              : unit === "Cents"
              ? `${totalArea} Cents`
              : `${totalArea} ${unit}`}
          </p>
        )}
        {(category === "villa" || category === "apartment") && bhk && (
          <p className="flex items-center gap-2 font-[Montserrat]">
            <BiBed className="font-semibold" />
            {`${bhk} BHK`}
            {hasBalcony && " - Balcony"}
            {hasTerrace && " - Terrace"}
          </p>
        )}
        <p className="font-[Montserrat] font-semibold">₹ {price}</p>

        {/* Conditionally truncate description based on view mode */}
        <p
          className={`font-[Montserrat] text-gray-600 overflow-hidden
    ${viewMode === "list" ? "line-clamp-3 md:line-clamp-3" : "line-clamp-3"}
  `}
        >
          {description}
        </p>

        {/* Status indicator */}
        <div className="mt-auto">
          <span
            className={`px-2 py-1 text-xs font-semibold ${
              status === "available"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {status === "available" ? "Available" : "Sold Out"}
          </span>
        </div>
      </div>

      {/* Action Icons */}
      <div className="absolute top-5 right-5 flex gap-3">
        <FaShareAlt
          className="text-3xl bg-gray-200 p-1 rounded-full cursor-pointer text-green-600 hover:text-green-800"
          onClick={(e) => {
            e.stopPropagation();
            setShareModel(true);
          }}
        />
      </div>
    </div>
  );
};

export default ProjectCard;
