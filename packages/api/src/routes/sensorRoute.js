/* 
 *  Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>   
 *  This file (fieldRoute.js) is part of LiteFarm.
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

const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');
const authFarmId = require('../middleware/acl/authFarmId');
const checkOwnership = require('../middleware/acl/checkOwnership');
const checkScope = require('../middleware/acl/checkScope');

// Get all sensors
// router.get('/sensors', authFarmId, sensorController.getAllSensors());

// Get a specific sensor by id
router.get('/:sensor_id', authFarmId, checkScope(['get:sensor']), sensorController.getSensorByID());

// Get sensors by field id
router.get('/:field_id', authFarmId, checkScope(['get:sensor']), sensorController.getSensorByFieldID());

// Get sensors by farm id
router.get('/:farm_id', authFarmId, checkScope(['get:sensor']), sensorController.getSensorByFarmID());

// Add sensor 
router.post('/', authFarmId, checkOwnership('farm'), checkScope(['add:sensor']), sensorController.addSensor());

// Delete sensor
router.delete('/:sensor_id', authFarmId, checkOwnership('farm'), checkScope(['delete:sensor']), sensorController.delSensor());

// Update sensor 
router.put('/:sensor_id', authFarmId, checkOwnership('farm'), checkScope(['edit:sensor']), sensorController.updateSensor());

module.exports = router;
