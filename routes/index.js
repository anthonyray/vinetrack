var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/v/:postId',function(req,res) {
	res.render('vine',{postId : req.params.postId});
})

module.exports = router;
