'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './card.events';

var CardSchema = new mongoose.Schema({
  name: String,
  cardnumber: Number,
  expdate: Date,
  cvv: Number,
});

registerEvents(CardSchema);
export default mongoose.model('Card', CardSchema);
