const express = require('express');
const {
  analyzeProfile,
  getProfile,
  listProfiles,
  removeProfile,
} = require('../controllers/profileController');

const router = express.Router();

router.post('/analyze', analyzeProfile);
router.get('/', listProfiles);
router.get('/:username', getProfile);
router.delete('/:username', removeProfile);

module.exports = router;
