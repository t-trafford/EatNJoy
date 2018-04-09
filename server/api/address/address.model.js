'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './address.events';

var AddressSchema = new mongoose.Schema({
  name: String,
  address1: String,
  address2: {type: String, required: false},
  city: String,
  state: String,
  country: String,
  type: String,
  phone: Number,
});

registerEvents(AddressSchema);
export default mongoose.model('Address', AddressSchema);
