'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './reservetable.events';

var ReservetableSchema = new mongoose.Schema({
  name: String,
  person: Number,
  email: String,
  time : { type : Date, default: Date.now },

});

registerEvents(ReservetableSchema);
export default mongoose.model('Reservetable', ReservetableSchema);
