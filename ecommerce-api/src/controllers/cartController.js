import Cart from '../models/cart.js';

async function getCarts(req, res, next) {
    try {
        const carts = await Cart.find().populate('user').populate('products.product');
        res.json(carts);
    }
    catch (error) {
        next(error);
    }
}

async function getCartById(req, res, next) {
    try {
        const id = req.params.id;
        const cart = await Cart.findById(id).populate('user').populate('products.product');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.json(cart);
    }
    catch (error) {
        next(error);
    }
}

async function getCartByUser(req, res, next) {
    try {
        const userId = req.params.id;
        const cart = await Cart.findOne({ user: userId }).populate('user').populate('products.product');
        if (!cart) {
            return res.status(404).json({ message: 'No cart found for this user' });
        }
        res.json(cart);
    }
    catch (error) {
        next(error);
    }
}

async function createCart(req, res, next) {
    try {
        const { user, products } = req.body;
        if (!user || !products || !Array.isArray(products)) {
            return res.status(400).json({
                error: 'User and products array is required'
            });
        }
        for(const item of products){
            if(!item.product || !item.quantity|| item.quantity <1){
                return res.status(400).json({error: 'Each product must have a product ID and quantity >=1'});
            }
        }
        
        const newCart = await Cart.create({
            user, products
        });

        await newCart.populate('user');
        await newCart.populate('products.products');

        res.status(201).json(newCart);
    }
    catch (error) {
        next(error);
    }
}

async function updateCart (req, res, next){
    try{
    const {id} = req.params;
    const {user, products} = req.body;
    if(!user || !products || !Array.isArray(products)){
        return res.status(400).json({error: 'User and products array is requried'});
    }

    for( const item of products){
        if(!item.product || item.quantity || item.quantity< 1){
            return res.status(400).json({error: 'Each product must have a product ID and quantity >=1'});
        }
    }

    const updatedCart = await Cart.findByIdAndUpdate(id,
        {user, products},
        {new: true}
    ).populate('user').populate('products.product');

    if(updatedCart){
        return res.status(200).json(updatedCart);
    } else{
        return res.status(404).json({message: 'Cart not found'});
    }
} catch(error){
    next(error);
}
}

async function deleteCart (req, res){
    try{
        const {id} = req.params;
        const deletedCart = await Cart.findByIdAndDelete(id);

        if(deletedCart){
            return res.status(404).send();
        }else{
            return res.status(404).json({message: 'Cart not found'});
        }
    }
    catch(error){
        res.status(500).json({error});
    }
}

async function addProductToCart(req, res, next){
    try{
        const {userId, productId, quantity =1} = req.body;

        if(!userId || productId || quantity < 1 ){
            return res.status(400).json({error: 'User Id, product Id and a valid quantity are required'});
        }

        let cart = await Cart.findOne({ user: userId});

        if(!cart){
            cart = new Cart({
                user: userId,
                products:[{product: productId, quantity}]
            });
        } else{
            const existingProductIndex = cart.products.findIndex(
                item => item.product.toString() === productId
            );
            if(existingProductIndex >=0){
                cart.products[existingProductIndex].quantity += quantity;
            }else{
                cart.products.push({product: productId, quantity});
            }
        }
        await cart.save();
        await cart.populate('user');
        await cart.populate('products.product');

        res.jason(200).json(cart);
    }
    catch(error){
        next(error);
    }
}

export {
    getCarts,
    getCartById,
    getCartByUser,
    createCart,
    updateCart,
    deleteCart,
    addProductToCart,
};