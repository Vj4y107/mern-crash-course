import Product from '../models/product.model.js';
import mongoose from 'mongoose';


export const getProducts = async (req, res) => {
    try {
        const products = await Product.find().lean();
        if (!products.length) {
            return res.status(404).json({ success: false, msg: "No products found" });
        }
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.error(`[Error] ${error.stack || error.message}`);
        res.status(500).json({ success: false, msg: "Server Error", error: error.message });
    }
};

export const createProducts = async (req, res) => {
    const { name, price, image } = req.body;

    if (!name || !price || !image) {
        return res.status(400).json({ success: false, msg: "Please provide all fields" });
    }

    try {
        const newProduct = new Product({ name, price, image });
        await newProduct.save();
        res.status(201).json({ success: true, msg: "Product created successfully", data: newProduct });
    } catch (error) {
        console.error(`[Error] ${error.stack || error.message}`);
        res.status(500).json({ success: false, msg: "Server Error", error: error.message });
    }
};

export const updateProducts =  async (req, res) => {
    const { id } = req.params;
    const productData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, msg: "Invalid Product ID" });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, productData, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ success: false, msg: "Product not found" });
        }

        res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
        console.error(`[Error] ${error.stack || error.message}`);
        res.status(500).json({ success: false, msg: "Server Error", error: error.message });
    }
};

export  const deleteProducts =  async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, msg: "Invalid Product ID" });
    }

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ success: false, msg: "Product not found" });
        }

        res.status(200).json({ success: true, msg: "Product deleted successfully", data: deletedProduct });
    } catch (error) {
        console.error(`[Error] ${error.stack || error.message}`);
        res.status(500).json({ success: false, msg: "Server Error", error: error.message });
    }
};
