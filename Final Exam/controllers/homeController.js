const router = require('express').Router();

const gemsService = require('../services/gemsService');
const { isAuth } = require('../middlewares/authMiddleware')


router.get('/', async (req, res) => {
    const latestStones = await gemsService.getLatest().lean();
    res.render('home', { latestStones });
})

router.get('/search', isAuth, async (req, res) => {
    const {name} = req.query;
    
    const stones = await gemsService.search(name).lean();
   
    res.render('search', { stones });  //, gems
})



module.exports = router;