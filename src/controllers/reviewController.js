import { StatusCodes } from 'http-status-codes'
import { Order } from '../models/Order.js'
import { Product } from '../models/Product.js'
import { ProductReview } from '../models/ProductReview.js'

export const createReview = async (req, res) => {
  const { orderId, productId, comment, rating } = req.body

  try {
    const order = await Order.findById(orderId)
    const product = await Product.findById(productId)
    if (order && product) {
      const review = await ProductReview.create({
        order,
        product,
        comment,
        rating,
      })

      return res.status(StatusCodes.CREATED).json({ review })
    }

    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: { message: 'Order || Product does not exist.' } })
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(error.message)
  }
}

export const getReviewsByProductId = async (req, res) => {
  try {
    const reviews = await ProductReview.find({ product: req.params.productId }).populate('product').populate('order')

    return res.status(StatusCodes.OK).json({ reviews })
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(error.message)
  }
}

export const getReviewsByUserId = async (req, res) => {
  try {
    const reviews = await ProductReview.find({ user: req.user._id }).populate('product')

    res.send(reviews)
  } catch (error) {
    res.status(404).send(error.message)
  }
}

export const getReviewById = async (req, res) => {
  try {
    const review = await ProductReview.findOne({
      _id: req.params.reviewId,
    }).populate('product')

    if (!review) {
      return res.status(404).send({ error: 'Review not found' })
    }

    res.send(review)
  } catch (error) {
    res.status(404).send(error.message)
  }
}

export const updateReview = async (req, res) => {
  try {
    const review = await ProductReview.findOne({ _id: req.params.reviewId })

    if (!review) {
      return res.status(404).send({ error: 'Review not found' })
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(401).send({ error: 'Unauthorized' })
    }

    review.text = req.body.text
    review.rating = req.body.rating

    await review.save()

    res.send(review)
  } catch (error) {
    res.status(400).send(error.message)
  }
}

export const deleteReview = async (req, res) => {
  try {
    const review = await ProductReview.findOne({ _id: req.params.reviewId })

    if (!review) {
      return res.status(404).send({ error: 'Review not found' })
    }

    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).send({ error: 'Unauthorized' })
    }

    await review.remove()

    res.send(review)
  } catch (error) {
    res.status(400).send(error.message)
  }
}
