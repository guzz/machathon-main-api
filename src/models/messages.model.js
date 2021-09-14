// messages-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'messages';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    text: { type: String, required: true },
    userFrom: { type: Schema.Types.ObjectId },
    userTo: { type: Schema.Types.ObjectId },
    wizardId: { type: Schema.Types.ObjectId },
    transport: {
      type: String,
      enum: [
        'api',
        'telegram'
      ]
    },
    tokenTo: { type: String },
    tokenFrom: { type: String },
    options: [String]
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
