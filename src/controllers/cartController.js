import { StatusCodes } from 'http-status-codes'
import { Cart } from '../models/Cart.js'
import { Product } from '../models/Product.js'
import { ShippingAddress } from '../models/ShippingAddress.js'

export const addProductToCart = async (req, res) => {
  const { productId, quantity } = req.body
  
  try {
    const product = await Product.findOne({ _id: productId })
    if (!product) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: { message: "product not found" } })
    }

    const cartItem = { product, quantity }

    const cart = await Cart.findOne({ owner: res.locals.user })
    if (cart) {
      cart.products.push(cartItem)
      cart.total = cart.total + (product.price * quantity)

      await cart.save();

      return res.status(StatusCodes.CREATED).json({ cart })
    }

    const newCart = await Cart.create({
      owner: res.locals.user,
      products: cartItem,
      total: cart.total + (product.price * quantity)
    })

    return res.status(StatusCodes.CREATED).json({ cart: newCart })

  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(error.message)
  }
}

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ owner: req.locals.user })

    return res.status(StatusCodes.OK).json({ cart })
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(error.message)
  }
}
