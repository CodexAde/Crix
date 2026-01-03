import { Roadmap } from "../models/roadmap.model.js";

export const createRoadmap = async (roadmapData) => {
  return await Roadmap.create(roadmapData);
};

export const findRoadmapsByUser = async (userId) => {
  return await Roadmap.find({ user: userId }).sort({ createdAt: -1 });
};

export const countRoadmapsByUser = async (userId) => {
  return await Roadmap.countDocuments({ user: userId });
};

export const findRoadmapById = async (id) => {
  return await Roadmap.findById(id);
};

export const deleteRoadmapById = async (id, userId) => {
  return await Roadmap.findOneAndDelete({ _id: id, user: userId });
};
