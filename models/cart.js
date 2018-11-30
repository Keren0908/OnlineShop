const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {
    static addProduct(id,productPrice) {
        // fetch the previous cart
        fs.readFile(p,(err,fileContent) => {
            let cart = {products: [], totalPrice: 0}
            if(!err){
                cart = JSON.parse(fileContent);
            }

             // analyze the cart => find existing product
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updateProduct;
            
             // add new product / increase quantity
            if(existingProduct){
                updateProduct = {...existingProduct};
                updateProduct.qty = updateProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updateProduct;
            }else{
                updateProduct = {id: id, qty: 1};
                cart.products = [...cart.products, updateProduct];
            }
            cart.totalPrice = cart.totalPrice + + productPrice;
            fs.writeFile(p,JSON.stringify(cart),(err) => console.log(err));
        });
    }

    static deleteProduct(id,productPrice){

        fs.readFile(p,(err,fileContent) => {
            if(err){
                return;
            }
            const cart = JSON.parse(fileContent);
            const updateCart = {...cart};
            const product = updateCart.products.find(prod => prod.id === id);
            if(!product){
                return;
            }
            updateCart.products = updateCart.products.filter(prod => prod.id !== id);
            
            updateCart.totalPrice = updateCart.totalPrice - productPrice * product.qty;
            

            fs.writeFile(p,JSON.stringify(updateCart),(err) => console.log(err));
        }
        )
    }

    static getProducts(cb){
        fs.readFile(p,(err,fileContent) => {
            const cart = JSON.parse(fileContent);
            if(err){
                cb(null);
            }else{
                cb(cart);
            }        
        })
    }


}