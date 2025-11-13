const { Schema, model } = require("mongoose");

const Star = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    massa: {
      type: String,
      required: true,
    },
    diametr: {
      type: String,
      required: true,
    },
    temprature: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    planets: [{type: Schema.Types.ObjectId, ref: "Planet"}]
  },
  { timestamps: true }
);

// Faqat delet uchun
Star.pre(['findOneAndDelete', 'findOneAndRemove'], async function(next){
  this.star = await this.model.findOne(this.getFilter())
  next()
})

Star.post(['findOneAndDelete', 'findOneAndRemove'], async function() {
    if (this.star && this.star.planets && this.star.planets.length > 0) {
        await mongoose.model('Planet').deleteMany({
            _id: { $in: this.star.planets }
        })
    }
})

Star.pre('deleteOne', { document: true, query: false }, async function(next) {
    if (this.planets && this.planets.length > 0) {
        await mongoose.model('Planet').deleteMany({
            _id: { $in: this.planets }
        })
    }
    next()
})

module.exports = model("Star", Star);
