'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './card.events';

var CardSchema = new mongoose.Schema({
  name: String,
  cardnumber: Number,
  expmon: Number,
  expyear: Number,
  cvv: Number,
  user:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

registerEvents(CardSchema);
export default mongoose.model('Card', CardSchema);
