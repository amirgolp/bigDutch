const express = require('express');
const router = express.Router();

const Batch = require('./Batch');

// @route    POST api/batch
// @desc     Register a batch
// @access   Public
router.post(
  '/',
  async (req, res) => {

    const { batchName, stockingDate, animalCount } = req.body;

    try {
      let batch = await Batch.findOne({ batchName });

      if (batch) {
        batch = await Batch.findOneAndUpdate(
            { batchName },
            { 
                $set: {
                    animalCount: animalCount
                }
        },
            { new: true }
        );
        return res
          .status(201)
          .json({ 
              message: [{ msg: 'batch already exists. animal count is updated' }],
              batch
            });
      }

      batch = new Batch({
        batchName,
        stockingDate,
        animalCount
      });

      await batch.save();
      res.json({batch});
      
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route    GET api/batch/:batchName
// @desc     Get batch by batchName
// @access   Public
router.get('/:batchName', async (req, res) => {
    try {
      const batch = await Batch.findOne({
        batchName: req.params.batchName
      });
  
      if (!batch) return res.status(400).json({ msg: 'Batch not found' });
  
      res.json(batch);
    } catch (err) {
      console.error(err.message);
      if (err.kind == 'ObjectId') {
        return res.status(400).json({ msg: 'Batch not found' });
      }
      res.status(500).send('Server Error');
    }
  });

module.exports = router;