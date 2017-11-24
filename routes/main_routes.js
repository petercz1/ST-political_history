var router = require('express').Router();
var PRESIDENTSCLASS = require('../mongodb/mongoose_connection');
module.exports = router;

router.get('/', do_homepage);

function do_homepage(req, res) {
  console.log('doing homepage');
  res.render('index');
}

// api

router.get('/api/v1/read', do_read);
router.post('/api/v1/create', do_create);
router.put('/api/v1/update', do_update);
router.delete('/api/v1/delete/:_id', do_delete);

function do_read(req, res) {
  console.log('reading all presidents');
  PRESIDENTSCLASS.find().sort({number:1})
    .then(function (results) {
      //console.log(results);
      res.json(results);
    })
}

function do_create(req, res) {
  console.log('creating a new president');
  console.log(req.body);
  var data = {
    number: req.body.number,
    president: req.body.president,
    birth_year: req.body.birth_year,
    death_year: null,
    took_office: req.body.took_office,
    left_office: null,
    party: req.body.party
  }
  var president = new PRESIDENTSCLASS(data);
  president.save().then(function (result) {
    console.log(result);
    res.json({
      message: 'backend saved!'
    });
  });
}

function do_update(req, res) {
  console.log('updating');
  console.log(req.body);
  var update = {
    $set: {
      number: req.body.number,
      president: req.body.president,
      birth_year: req.body.birth_year,
      death_year: req.body.death_year,
      took_office: req.body.took_office,
      left_office: req.body.left_office,
      party: req.body.party
    }
  }
  PRESIDENTSCLASS.findByIdAndUpdate(req.body._id, update).then(function (result) {
    console.log(result);
    res.json({
      message: 'backend updated!'
    });
  });
}

function do_delete(req, res) {
  console.log('deleting');
  console.log(req.params);
  PRESIDENTSCLASS.findByIdAndRemove(req.params._id).then(
    function (result) {
      console.log(result);
      res.json({
        message: 'backend deleted!'
      })
    })
}