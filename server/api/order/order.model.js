'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './order.events';

var OrderSchema = new mongoose.Schema({
  price: Number,
  item: {
    type: [mongoose.Schema.Types.Mixed],
    required: true
  },
  createdDate: {
    type: Date,
    default: new Date()
  },
  quantity: Number,
  orderId: {
    type: mongoose.Schema.Types.Mixed,
    // required: true//,
    // default: Math.floor((Math.random() * 10000) + 1)
  },
  invoiceNumber: {
    type: mongoose.Schema.Types.Mixed,
    // required: true//,
  //  default: Math.floor((Math.random() * 1000000) + 1)
  },
  address: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  card: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },

  user:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  active: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    default: 'Pending'
  }
});

OrderSchema
  .pre('save', function (next) {
    // Handle new/update orders
    if (this._id && this.isModified('invoiceNumber')) {
      return next();
    }
    if (!(this.invoiceNumber && this.orderId)) {
      this.orderId = Math.floor((Math.random() * 10000) + 1);
      this.invoiceNumber = Math.floor((Math.random() * 1000000) + 1);
    }
    return next();
  });

  
registerEvents(OrderSchema);
export default mongoose.model('Order', OrderSchema);
