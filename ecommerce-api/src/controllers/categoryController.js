import Category from '../models/category.js';
import errorHandler from '../middleware/errorHandler.js';

async function getCategories(req, res, next){
    try{
        const categories = await Category.find().populate('parentCategory').sort({ name: 1});
        res.status(200).json(categories);
    }catch(error){
        next();
    }
}

async function getCategoriesById(req, res, next){
    try{
        const category = await Category.findById(req.params.id).populate(
            'parentCategory'
        );
        if(!category){
            return res.status(404).json({message: 'Category not found'});
        }
        res.status(200).json(category);
    }catch(error){
        next();
    }
}

async function createCategory(req, res, next){
    try{
        const {name, group, description, imageUrl, parentCategory} = req.body;
        const newCategory = new Category({
            name, group, description, imageURL: imageUrl || null, parentCategory: parentCategory || null,
        });
        await newCategory.save(); res.status(201).json(newCategory);
    }catch(error){
        next();
    }
}

async function updateCategory(req, res, next){
    try{
        const {name, group, description, imageURL, parentCategory} = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(
            idCategory,
            {name, group, description, imageURL, parentCategory},
            {new: true}
        );

        if(!updatedCategory){
            return res.status(400).json({message: 'Category not found'});
        }
        res.status(200).json(updatedCategory);
    }catch(error){
        next(error);
    }
}

async function deleteCategory(req, res, next){
    try{
        const idCategory = req.params.id;
        const deletedCategory = await Category.findByIdAndDelete(idCategory);

        if(!deletedCategory){
            return res.status(404).json({message: 'Category not found'});
        }
        res.status(204).send();
    }catch(error){
        next(error);
    }
}

async function searchCategory(req, res, next){
    try{
        const {q, parentCategory, sort, order, page =1, limit = 10} = req.query;

        let filters = {};

        if(q){
            filters.$or = [
                {name: {$regex: q, $options: "i"}},
                {description: {$regex: q, $options: "i"}},
            ];
        }
        if(parentCategory){
            filters.parentCategory = parentCategory;
        }
        let sortOptions = {};
        if(sort){
            const sortOrder = order === "desc" ? -1 : 1; sortOptions[sort] = sortOrder;
        }else{
            sortOptions.name = -1;
        }
        const skip = (parseInt(page)-1) * parseInt(limit);

        const categories = await Category.find(filters).populate("parentCategory").sort(sortOptions).skip(skip).limit(parseInt(limit));

        const totalResults = await Category.countDocuments(filters);

        const totalPages = Math.ceil(totalResults / parseInt(limit));

        res.status(200).json({
            categories,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalResults,
                hasNext: parseInt(page) < totalPages,
                nasPrev: parseInt(page) > 1,
            },
            searchTerm: q || null,
            parentCategory: parentCategory || null,
            sort: sort || 'name',
            order: order || 'desc'
        });
    }catch(error){
        next(error);
    }
};

export {
    getCategories,
    getCategoriesById,
    createCategory,
    updateCategory,
    deleteCategory,
    searchCategory
};