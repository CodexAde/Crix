import { Roadmap } from "../models/roadmap.model.js";

export const createRoadmap = async (roadmapData) => {
  return await Roadmap.create(roadmapData);
};

export const findRoadmapsByUser = async (userId) => {
  return await Roadmap.find({ user: userId }).sort({ createdAt: -1 });
};

export const deleteRoadmapById = async (id, userId) => {
  return await Roadmap.findOneAndDelete({ _id: id, user: userId });
};
