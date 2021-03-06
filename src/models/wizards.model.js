// wizards-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'wizards';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    contentId: { type: String, required: true },
    currentStep: { type: Number, default: 0 },
    steps: {
      type: [{
        stepContentId: String,
        stepType: String,
        skip: Boolean,
        key: String,
        options: [String],
        value: Schema.Types.Mixed
      }]
    },
    userToken: { type: String },
    userId: Schema.Types.ObjectId,
    isDone: { type: Boolean }
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
  
};
