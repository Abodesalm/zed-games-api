const Report = require("./../models/reportModel");
const factory = require("./handlerFactory");
const catchAsync = require("./../utils/catchAsync");
const sharp = require("sharp");
const multer = require("multer");

exports.getReports = factory.getAll(Report);

exports.getReport = factory.getOne(Report);

exports.createReport = factory.createOne(Report);

exports.updateReport = factory.updateOne(Report);

exports.deleteReport = factory.deleteOne(Report);
