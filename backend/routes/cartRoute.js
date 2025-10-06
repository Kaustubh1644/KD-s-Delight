import  express  from 'express';
import { getCart } from './../controllers/cartController.js';
import authMiddleware from './../middleware/auth.js';
import { deleteItem } from './../controllers/itemController.js';
import {
  addToCart,
  clearCart,
  updateCartItem,
  deleteCartItem,
} from './../controllers/cartController.js';
const router = express.Router();

router.route('/')
 .get(authMiddleware, getCart)
 .post(authMiddleware, addToCart)

 router.post('/clear', authMiddleware, clearCart)

 router.route('/:id')
   .put(authMiddleware, updateCartItem)
   .delete(authMiddleware, deleteCartItem)

   export default router