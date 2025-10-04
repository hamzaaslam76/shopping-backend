const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const APIFeatures = require('../utils/apiFeatures');
exports.deleteOne = Model => catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);
        if (!doc)
        {
           return next(new AppError("no document found with that  id", 404));
            }
        res.status(204).json({
            status: "success",
            data:null
        });
   
})

exports.updateOne = Model => catchAsync(async (req, res,next) => {
    // Process uploaded files and form data for updates
    let updateData = { ...req.body };
    
    // Handle file uploads
    if (req.file) {
        // Single file upload (category image)
        updateData.image = `/uploads/categories/${req.file.filename}`;
    }
    
    if (req.files && req.files.length > 0) {
        // Multiple file uploads (product images) - append to existing images
        const newImages = req.files.map(file => ({
            url: `/uploads/products/${file.filename}`,
            alt: file.originalname
        }));
        
        // Get existing product to preserve current images
        const existingDoc = await Model.findById(req.params.id);
        if (existingDoc && existingDoc.images) {
            updateData.images = [...existingDoc.images, ...newImages];
        } else {
            updateData.images = newImages;
        }
    }
    
    // Parse JSON fields if they exist
    if (updateData.attributes && typeof updateData.attributes === 'string') {
        try {
            updateData.attributes = JSON.parse(updateData.attributes);
        } catch (err) {
            updateData.attributes = {};
        }
    }
    
    // Convert boolean strings
    if (updateData.isActive === 'true') updateData.isActive = true;
    if (updateData.isActive === 'false') updateData.isActive = false;
    
    // Convert numeric strings
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.salePrice) updateData.salePrice = parseFloat(updateData.salePrice);
    if (updateData.stock) updateData.stock = parseInt(updateData.stock);

    const doc = await Model.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true
    });
    
    if (!doc) {
       return next(new AppError("this record was not exist in database", 404));
    }
    
    res.status(200).json({
        status: "success",
        data: {
            doc
        }
    });
});

exports.create = Model => catchAsync(async (req, res, next) => {
    // Process uploaded files and form data
    let createData = { ...req.body };
    
    // Handle file uploads
    if (req.file) {
        // Single file upload (category image)
        createData.image = `/uploads/${req.file.filename}`;
    }
    
    if (req.files && req.files.length > 0) {
        // Multiple file uploads (product images)
        createData.images = req.files.map(file => ({
            url: `/uploads/products/${file.filename}`,
            alt: file.originalname
        }));
    }
    
    // Parse JSON fields if they exist
    if (createData.attributes && typeof createData.attributes === 'string') {
        try {
            createData.attributes = JSON.parse(createData.attributes);
        } catch (err) {
            createData.attributes = {};
        }
    }
    
    // Convert boolean strings
    if (createData.isActive === 'true') createData.isActive = true;
    if (createData.isActive === 'false') createData.isActive = false;
    
    // Convert numeric strings
    if (createData.price) createData.price = parseFloat(createData.price);
    if (createData.salePrice) createData.salePrice = parseFloat(createData.salePrice);
    if (createData.stock) createData.stock = parseInt(createData.stock);
    
    const doc = await Model.create(createData);
    res.status(201).json({
        status: 'success',
        data: {
            doc: doc
        }
    })
});

exports.getOne = (Model , popOptions) => catchAsync (async (req, res,next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
     if (!doc)
     {
        return next(new AppError("this record was not exist in database", 404));
         }
        
        res.status(200).json({
            status: 'success',
            data: {
                doc
            }
    });   
});

exports.getAll = Model => catchAsync(async (req, res, next) => {
    // to allow for nested GET review on tour (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId }
    
    const features = new APIFeatures(Model.find(filter), req.query).filter().sorts().limitFields().pagination();
      // explain the query of document show the detail of the query      
    // const doc = await features.query.explain();
    const doc = await features.query;
   
    res.status(200).json({
        status: 'success',
        requesttime: res.requestTime,
        results: doc.length,
        data: {
            doc
        }
    });
})
