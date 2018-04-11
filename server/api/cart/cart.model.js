'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './cart.events';

var CartSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.ObjectId,
    ref: 'Item',
    required: true
  },
  createdDate: {
    type: Date,
    default: new Date()
  },
  quantity: Number,
  user:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  active: {
    type: Boolean,
    default: true
  }
});

registerEvents(CartSchema);
export default mongoose.model('Cart', CartSchema);
