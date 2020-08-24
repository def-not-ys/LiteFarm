/* 
 *  Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>   
 *  This file (fieldController.js) is part of LiteFarm.
 *  
 *  LiteFarm is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  
 *  LiteFarm is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details, see <https://www.gnu.org/licenses/>.
 */

const baseController = require('../controllers/baseController');
const { transaction, Model } = require('objection');
const sensorModel = require('../models/sensorModel');

class sensorController extends baseController {
  constructor() {
    super();
  }

  static getAllSensors() {
    return async (req, res) => {
      try {
        const rows = await baseController.get(sensorModel);
        if (!rows.length) {
          res.sendStatus(404)
        }
        else {
          res.status(200).send(rows);
        }
      }
      catch (error) {
        //handle more exceptions
        res.status(400).json({
          error,
        });
      }
    }
  }

  static addSensor() {
    return async (req, res) => {
      const trx = await transaction.start(Model.knex());
      try {
        const result = await baseController.postWithResponse(sensorModel, req.body, trx);
        await trx.commit();
        res.status(201).send(result);
      } catch (error) {
        //handle more exceptions
        await trx.rollback();
        res.status(400).json({
          error,
        });
      }
    };
  }

  static delSensor(){
    return async(req, res) => {
      const trx = await transaction.start(Model.knex());
      try{
        const isDeleted = await baseController.delete(sensorModel, req.params.id, trx);
        await trx.commit();
        if(isDeleted){
          res.sendStatus(200);
        }
        else{
          res.sendStatus(404);
        }
      }
      catch (error) {
        await trx.rollback();
        res.status(400).json({
          error,
        });
      }
    }
  }

  static updateSensor(){
    return async(req, res) => {
      const trx = await transaction.start(Model.knex());
      try{
        const updated = await baseController.put(sensorModel, req.params.id, req.body, trx);
        await trx.commit();
        if(!updated.length){
          res.sendStatus(404);
        }
        else{
          res.status(200).send(updated);
        }

      }
      catch (error) {
        await trx.rollback();
        res.status(400).json({
          error,
        });
      }
    }
  }

  static getSensorByID() {
    return async (req, res) => {
      try {
        const sensor_id = req.params.sensor_id;
        const row = await baseController.getIndividual(sensorModel, sensor_id);
        if (!row.length) {
          res.status(200).send(row);
        }
        else {
          res.status(200).send(row);
        }
      }
      catch (error) {
        //handle more exceptions
        res.status(400).json({
          error,
        });
      }
    }
  }

  static getSensorByFieldID() {
    return async (req, res) => {
      try {
        const field_id = req.params.field_id;
        const rows = await baseController.getByFieldId(sensorModel, 'field_id', field_id);
        if (!rows.length) {
          res.status(200).send(rows);
        }
        else {
          res.status(200).send(rows);
        }
      }
      catch (error) {
        //handle more exceptions
        res.status(400).json({
          error,
        });
      }
    }
  }

  static getSensorByFarmID() {
    return async (req, res) => {
      try {
        const farm_id = req.params.farm_id;
        const rows = await sensorController.getByForeignKey(sensorModel, 'farm_id', farm_id);
        if (!rows.length) {
          res.status(200).send(rows);
        }
        else {
          res.status(200).send(rows);
        }
      }
      catch (error) {
        //handle more exceptions
        res.status(400).json({
          error,
        });
      }
    }
  }

  static async getByForeignKey(farm_id) {

    const fieldSensors = await sensorModel.query().select('*').from('sensor').join('field', function () {
      this.on('sensor.field_id', '=', 'field.field_id');
    }).where('field.farm_id', farm_id)
      .join('farm', function () {
        this.on('field.farm_id', '=', 'farm.farm_id');
      });

    return fieldSensors;
  }
}

module.exports = sensorController;