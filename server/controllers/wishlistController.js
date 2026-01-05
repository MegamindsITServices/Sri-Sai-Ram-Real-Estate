
const Wishlist = require("../models/Wishlist");

// Add to wishlist
const postWishlist=async (req, res) => {
  const { userId, listingId } = req.body;

  try {
    const existingItem = await Wishlist.findOne({ userId, id: listingId });
    if (existingItem) {
      // If already in wishlist, remove it
      await Wishlist.deleteOne({ _id: existingItem._id });
      return res.status(200).json({ success: true, message: "Removed from wishlist" });
    } else {
      // Otherwise, add to wishlist
      const newWishlistItem = new Wishlist({ userId, id: listingId });
      await newWishlistItem.save();
      return res.status(201).json({ success: true, message: "Added to wishlist" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getWishlist=async (req, res) => {
    const { userId, listingId } = req.query;
    try {
      // Check if the wishlist entry exists
      const existingItem = await Wishlist.findOne({ userId, id: listingId });
  
      if (existingItem) {
        return res.status(200).json({ success: true, isInWishlist: true });
      } else {
        return res.status(200).json({ success: true, isInWishlist: false });
      }
    } catch (error) {
      console.error("Error fetching wishlist status:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  const getAll=async(req,res)=>{
    try {
        const { userId } = req.params;
        const wishlistItems = await Wishlist.find({ userId }).populate("id"); // Populates listing details
        res.status(200).json(wishlistItems);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch wishlist items" });
      }
  }

module.exports = {postWishlist,getWishlist,getAll};
