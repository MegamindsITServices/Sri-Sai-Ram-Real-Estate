import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaHome, FaMap, FaShareAlt, FaHeart } from 'react-icons/fa';
import { BiBed } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import API from '../../utils/API';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Share from '../models/Share';
import stickerImage from "../../assets/Star 6.png";
import sold from "../../assets/sold.png";

const ProjectCard = ({ product, viewMode = 'list' }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const navigate = useNavigate();
  const [shareModel, setShareModel] = useState(false);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    try {
      const fetchWishlistStatus = async () => {
        try {
          const response = await API.get(`/wishlist/getWishlist`, {
            params: {
              userId: user._id,
              listingId: product._id,
            },
          });
          setIsInWishlist(response.data.isInWishlist);
        } catch (error) {
          console.error("Failed to fetch wishlist status", error);
        }
      };

      fetchWishlistStatus();
    } catch (err) {
      console.log(err.message);
    }
  }, []);

  const incrementProjectView = async (id) => {
    await API.post("/projects/incrementProjectView", {
      userId: user._id,
      projectId: id
    });
  };

  const handleWishlistToggle = async () => {
    try {
      const response = await API.post(`/wishlist/postWishlist`, {
        userId: user._id,
        listingId: product._id,
      });
      if (response.data.success) {
        setIsInWishlist(!isInWishlist);
        toast.success('wishlist updated');
      }
    } catch (error) {
      console.error("Failed to update wishlist", error);
    }
  };

  const handleCardClick = () => {
    incrementProjectView(product._id);
    navigate(`/projectDetail/${product.title}/${product._id}`, { state: product });
  };

  return (
    <div
      className={`border rounded-lg shadow-lg p-4 bg-white relative hover:cursor-pointer ${
        viewMode === "list"
          ? "flex flex-col md:flex-row md:gap-4 gap-2"
          : "flex flex-col h-full"
      }`}
    >
      {/* Sticker - same for both views */}
      {product.status !== "sold-out" ? (
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
          image={product.thumbnail}
          title={product.title}
          url={`https://srisairam.co.in/projectDetail/${encodeURIComponent(
            product.title
          )}/${product._id}`}
          setShareModel={setShareModel}
        />
      )}

      {/* Thumbnail with conditional styling based on view mode */}
      <div
        className={
          viewMode === "list"
            ? "w-full md:max-w-[30%] md:min-w-[30%]"
            : "w-full"
        }
        onClick={handleCardClick}
      >
        <img
          src={product.thumbnail}
          alt={product.title}
          className={`object-cover rounded-md ${
            viewMode === "list"
              ? "w-full h-52 mb-4 mt-3 md:mt-0"
              : "w-full h-48 mb-3"
          }`}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 flex-grow" onClick={handleCardClick}>
        <h2 className="text-xl font-bold flex items-center gap-2 font-[firaSans]">
          <FaHome /> {product.title}
        </h2>
        <p className="flex items-center gap-2 font-[Montserrat]">
          <FaMapMarkerAlt /> {product.locationTitle}
        </p>
        <p className="flex items-center gap-2 font-[Montserrat]">
          <FaMap />
          {product.unit === "sqft"
            ? `${product.totalArea} Sq.ft `
            : product.unit === "Acre"
            ? `${product.totalArea} Acre`
            : `${product.totalArea} Cents`}
        </p>
        {product.category === "house" && (
          <p className="flex items-center gap-2 font-[Montserrat]">
            <BiBed className="font-semibold" />
            {`${product.bhk} BHK${product.balcony ? " - Balcony" : ""}${
              product.terrace ? " - Terrace" : ""
            }`}
          </p>
        )}
        <p className="font-[Montserrat] font-semibold">
          ₹ {Number(product.price).toLocaleString("en-IN")}
        </p>

        {/* Conditionally truncate description based on view mode */}
        <p className="font-[Montserrat]">
          {viewMode === "list"
            ? product.description.length > 142
              ? `${product.description.substring(0, 143)}...`
              : product.description
            : product.description.length > 80
            ? `${product.description.substring(0, 80)}...`
            : product.description}
        </p>
      </div>

      {/* Action Icons */}
      <div className="absolute top-4 right-4 flex gap-3">
        {/* <FaHeart
          className={`text-xl cursor-pointer ${
            isInWishlist ? 'text-red-500' : 'text-gray-400'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            handleWishlistToggle();
          }}
        /> */}
        <FaShareAlt
          className="text-xl cursor-pointer text-black hover:text-black"
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