import {
  GET_CROPS,
  CREATE_CROP,
} from "./constants";

import {
  setCropsInState,
} from "./actions";
import { put, takeEvery, call } from 'redux-saga/effects';
import apiConfig from '../../../apiConfig';

const axios = require('axios');

//FIXME: this is repeated code from Field/saga
export function* getCropsSaga() {
  const farm_id = localStorage.getItem('farm_id');
  const { cropURL } = apiConfig;
  const header = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
      user_id: localStorage.getItem('user_id'),
      farm_id: localStorage.getItem('farm_id'),
    },
  };

  try {
    const result = yield call(axios.get, cropURL + '/farm/' + farm_id, header);
    if (result) {
      yield put(setCropsInState(result.data));
    }
  } catch(e) {
    console.log('failed to fetch all crops from database');
  }
}

export function* createCropSaga(action) {
  const farm_id = localStorage.getItem('farm_id');
  const { cropURL } = apiConfig;
  const header = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('id_token'),
      user_id: localStorage.getItem('user_id'),
      farm_id: localStorage.getItem('farm_id'),
    },
  };

  const data = {
    crop_id: action.cropId,
    crop_common_name: action.crop_common_name,
    crop_genus: action.crop_genus,
    crop_specie: action.crop_specie,
    crop_group: action.crop_group,
    crop_subgroup: action.crop_subgroup,
    max_rooting_depth: action.max_rooting_depth,
    depletion_fraction: action.depletion_fraction,
    is_avg_depth: action.is_avg_depth,
    initial_kc: action.initial_kc,
    mid_kc: action.mid_kc,
    end_kc: action.end_kc,
    max_height: action.max_height,
    is_avg_kc: action.is_avg_kc,
    nutrient_notes: action.nutrient_notes,
    percentrefuse: action.percentrefuse,
    refuse: action.refuse,
    protein: action.protein,
    lipid: action.lipid,
    energy: action.energy,
    ca: action.ca,
    fe: action.fe,
    mg: action.mg,
    ph: action.ph,
    k: action.k,
    na: action.na,
    zn: action.zn,
    cu: action.cu,
    fl: action.fl,
    mn: action.mn,
    se: action.se,
    vita_rae: action.vita_rae,
    vite: action.vite,
    vitc: action.vitc,
    thiamin: action.thiamin,
    riboflavin: action.riboflavin,
    niacin: action.niacin,
    pantothenic: action.pantothenic,
    vitb6: action.vitb6,
    folate: action.folate,
    vitb12: action.vitb12,
    vitk: action.vitk,
    is_avg_nutrient: action.is_avg_nutrient,
    farm_id: farm_id,
    user_added: action.user_added,
    deleted: action.deleted,
    nutrient_credits: action.nutrient_credits,
  };
  try {
    const result = yield call(axios.post, cropURL + '/', data, header);
    if (result) {
      const result = yield call(axios.get, cropURL + '/farm/' + farm_id, header);
      if (result) {
        yield put(setCropsInState(result.data));
      } else {
        console.log('failed to fetch all crops from database');
      }
    }
  } catch(e) {
    console.log('failed to add fieldCrop to database');
  }
}

export default function* cropSaga() {
  yield takeEvery(GET_CROPS, getCropsSaga);
  yield takeEvery(CREATE_CROP, createCropSaga);
}
