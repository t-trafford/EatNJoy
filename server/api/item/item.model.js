'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './item.events';

var ItemSchema = new mongoose.Schema({
  name: String,
  foodItemName: String,
  active: Boolean,
 // picture: {type: Schema.Types.Mixed, required: true},
  price: Number,
  ingredients: String

});

registerEvents(ItemSchema);
export default mongoose.model('Item', ItemSchema);
