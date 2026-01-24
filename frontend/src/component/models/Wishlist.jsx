import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineDelete } from "react-icons/ai";
import { useSelector } from "react-redux";
import API from "../../utils/API";
const Wishlist = ({ setWishModel }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
const user=useSelector((state)=>state.user.user);
const [condition,setCondition]=useState(false);
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await API.get(`/wishlist/getAll/${user._id}`);
        setWishlistItems(response.data);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user._id,condition]);
 


  const deleteItem=async(id)=>{
    try{
        const response = await API.post(`/wishlist/postWishlist`, {
            userId:user._id,
            listingId: id,
          });
         setCondition(!condition);
         window.location.reload();
    }catch(err){
        console.log(err.message);
    }
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 md:p-8 w-[90%] max-h-[80%] overflow-y-auto max-w-4xl custom-scrollbar relative shadow-lg">
      {/* Close Button */}
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        onClick={() => setWishModel(false)}
        aria-label="Close Modal"
      >
        ✖
      </button>

      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Your Wishlist</h2>

      {/* Wishlist Content */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : wishlistItems.length === 0 ? (
        <p className="text-center text-gray-500">Your wishlist is empty.</p>
      ) : (
        <ul className="space-y-4">
          {wishlistItems.map((item) => (
            <li
              key={item._id}
              className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-100 rounded-lg shadow-sm"
            >
              {/* Thumbnail */}
              <img
                src={item.id.thumbnail}
                alt={item.id.title}
                className="w-24 h-24 rounded-lg object-cover sm:mr-4 mb-4 sm:mb-0"
              />

              {/* Item Info */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.id.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {item.id.bhk}BHK{item.id.balcony? '- Balcony':null}{item.id.terrace? '- Terrace':null} | {item.id.Acre}  | ₹ {Number(item.id.price).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">{item.id.location}</p>
              </div>

              {/* Delete Button */}
              <button
                className="text-red-500 hover:text-red-700 transition-colors"
                aria-label="Delete from Wishlist"
                onClick={()=>deleteItem(item.id._id)}
              >
                <AiOutlineDelete size={24} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
  );
};

export default Wishlist;
