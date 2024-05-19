// basic setup for resolvers
const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

// hints from Module 21
const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
              data = await User.findOne({ _id: context.user._id })
              .select('-__v -password')
              .populate('book');
              return data;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        users: async () => {
          return User.find().select('-__v -password').populate('book');
        },
        user: async (parent, { username }) => {
          return User.findOne({ username })
            .select('-__v -password')
            .populate('book');
        }
    },

    Mutation: {
        addUser: async (parent, { username, email, password }) => {
          const user = await User.create({ username, email, password });
          const token = signToken(user);
          return { token, user };
        },
        login: async (parent, { email, password }) => {
          const user = await User.findOne({ email });

          if (!user) {
            throw new AuthenticationError('User not found. Do you have an account?');
          }

          const correctPw = await user.isCorrectPassword(password);

          if (!correctPw) {
            throw new AuthenticationError('Incorrect credentials!');
          }

          const token = signToken(user);

          return { token, user };
        },
        saveBook: async (parent, { newBook }, context) => {
          console.log(context.user);
          console.log(newBook);
          if (context.user) {
            const updatedUser = await User.findByIdAndUpdate(
              { _id: context.user._id },
              { $push: { savedBooks: newBook }},
              { new: true }
            );
            return updatedUser;
          }
          throw new AuthenticationError('You need to be logged in!');
        },
        removeBook: async (parent, { bookId }, context) => {
          console.log(args);
          if (context.user) {
            const updatedUser = await User.findByIdAndUpdate(
              { _id: context.user._id },
              { $pull: { savedBooks: { bookId }}},
              { new: true }
            );
            return updatedUser;
          }
          throw new AuthenticationError('Login required!');
        },
    }
};

module.exports = resolvers;
