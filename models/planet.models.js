const { Schema, model, default: mongoose } = require("mongoose");

const Planet = new Schema({
  name: {
    type: String,
    required: true,
    
  },
  distanceToStar: {
    type: String,
    required: true,
  },
  diametr: {
    type: String,
    required: true,
  },
  yearDuration: {
    type: String,
    required: true,
  },
  dayDuration: {
    type: String,
    required: true,
  },
  temprature: {
    type: String,
    required: true,
  },
  sequenceNumber: {
    type: Number,
    required: true,
  },
  satellites: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  star: {
    type: Schema.Types.ObjectId,
    ref: "Star"
  }
}, {timestamps: true});

// Planet o'chirilganda Star dan ham o'chirish
Planet.pre(['findOneAndDelete', 'findOneAndRemove'], async function(next){
  this.planet = await this.model.findOne(this.getFilter())
  next()
})

Planet.post(['findOneAndDelete', 'findOneAndRemove'], async function(next){
  if(this.planet && this.planet.star){
    await mongoose.model('Star').findByIdAndUpdate(this.planet.star, {
      $pull: {planets: this.planet._id}
    })
  }
})

Planet.pre('deleteOne', {document:true, query: false}, async function(next){
  if(this.star){
    await mongoose.model('Star').findByIdAndUpdate(this.star, {
      $pull : {planets: this._id}
    })
  }
})

module.exports = model("Planet", Planet);


