import slugify from "slugify";
import Category from "../models/CategoryModel.js";
import redisClient from "../config/redis.js";


export const CatagoryController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }
        const existingCategory = await Category.findOne({ name: name });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: "Category already exists"
            });
        }   
        const category = await new Category({
            name: name,
            slug: slugify(name),
        });

        await category.save();

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "error from create catagory api",
            error: error.message
        });
    }
}

export const UpdateCatagory = async (req,res) =>{
    try {
        const {name} = req.body;
        const {id} = req.params;
        const category = await Category.findByIdAndUpdate(id, {name: name, slug: slugify(name)}, {new: true});
        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category
        });
    } catch (error) {
        console.log("error from catagory update api");
        res.status(500).json({
            success:false,
            message:"error from update catagory api",
            error:error.message
        })
    }
}


export const getCategories = async (req, res) => {
  try {
    const start = Date.now();
    const cachedCategories = await redisClient.get("categories");

    if (cachedCategories) {
      console.log("Redis HIT → categories");
      console.log("getCategories (Redis):", Date.now() - start, "ms");

      return res.status(200).json({
        success: true,
        source: "redis",
        categories: JSON.parse(cachedCategories),
      });
    }

    console.log("Redis MISS → MongoDB");

    const categories = await Category.find({});

    await redisClient.setEx(
      "categories",
      300,
      JSON.stringify(categories)
    );

    console.log("getCategories (MongoDB):", Date.now() - start, "ms");

    res.status(200).json({
      success: true,
      source: "mongodb",
      categories,
    });
  } catch (error) {
    console.log("error from get category api", error);
    res.status(500).json({
      success: false,
      message: "error from get category api",
      error: error.message,
    });
  }
};


export const SingleCategory = async (req, res) => {
    try {
        const { slug } = req.params;
        const category = await Category.findOne({ slug: slug });
        if (!category) {    
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }   
        res.status(200).json({
            success: true,
            message: "Category fetched successfully",
            category
        }); 
    } catch (error) {
        console.log("error from single catagory api");  
        res.status(500).json({
            success: false,
            message: "error from single catagory api",
            error: error.message
        }); 
    }
}

export const deleteCategory = async (req, res) => { 
    try {
        const {id} = req.params;
        await Category.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Category Deleted successfully",
        }); 
    } catch (error) {
        console.log("error from delete catagory api");  
        res.status(500).json({
            success: false,
            message: "error from delete catagory api",
            error: error.message
        }); 
    }
}