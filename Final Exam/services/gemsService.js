const Stones = require('../models/Stones');
const User = require('../models/User');

exports.getAll = () => Stones.find();

exports.create = async (userId, gemsData) => {
  const createdGem = await Stones.create({
    owner: userId,
    ...gemsData,
  });


  await User.findByIdAndUpdate(userId, { $push: { createdStones: createdGem._id } });

  return createdGem;
};

exports.delete = (gemsId) => Stones.findByIdAndDelete(gemsId);

exports.getOneDetailed = (gemsId) => Stones.findById(gemsId).populate('owner').populate('likedList');

exports.signUp = async (gemsId, userId) => {

  const gem = await Stones.findById(gemsId);
  const user = await User.findById(userId);

  gem.likedList.push(userId);
  user.listOfLikes.push(gemsId);

  await gem.save();
  await user.save();
};

exports.getOne = (gemsId) => Stones.findById(gemsId);

exports.edit = (gemId, gemData) => Stones.findByIdAndUpdate(gemId, gemData, { runValidators: true });

exports.getLatest = () => Stones.find().sort({ createdAt: -1 }).limit(3);

exports.search = (name) => {
  let query = {}; // TODO: Not ideal, filter result in mongodb

  if (name) {
    query.name = new RegExp(name, 'i');
    
  }
  console.log(query)
  return Stones.find(query);

}