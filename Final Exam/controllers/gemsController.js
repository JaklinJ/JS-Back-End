const router = require('express').Router();
const { isAuth } = require('../middlewares/authMiddleware')
const { getErrorMessage } = require('../utils/errorUtils')

const gemsService = require('../services/gemsService');


router.get('/', async (req, res) => {
    const gems = await gemsService.getAll().lean();

    res.render('gems/dashboard', { gems })
});

router.get('/create', isAuth, (req, res) => {
    res.render('gems/create');
});

router.post('/create', isAuth, async (req, res) => {
    const gemsData = req.body;

    try {
        await gemsService.create(req.user._id, gemsData);

        res.redirect('/gems')
    } catch (err) {
        res.render('gems/create', { ...gemsData, error: getErrorMessage(err) })
    }
});

router.get('/:gemsId/details', async (req, res) => {
    const gem = await gemsService.getOneDetailed(req.params.gemsId).lean();
    const isOwner = gem.owner && gem.owner._id == req.user?._id;
    const isLiked = gem.likedList.some(user => user._id == req.user?._id);

    res.render('gems/details', { ...gem, isOwner, isLiked }); //, signUpUsers, isOwner, isSigned
});

router.get('/:gemsId/like', async (req, res) => {
    await gemsService.signUp(req.params.gemsId, req.user._id);

    res.redirect(`/gems/${req.params.gemsId}/details`);
});

router.get('/:gemsId/delete', isGemOwner, async (req, res) => {
    await gemsService.delete(req.params.gemsId);

    res.redirect('/gems');
});

router.get('/:gemsId/edit', isGemOwner, async (req, res) => {
    res.render('gems/edit', { ...req.gem });
});

router.post('/:gemsId/edit', isGemOwner, async (req, res) => {
    const gemData = req.body;

    try {
        await gemsService.edit(req.params.gemsId, gemData);
        res.redirect(`/gems/${req.params.gemsId}/details`)
    } catch (err) {
        res.render('gems/edit', { ...gemData, error: getErrorMessage(err) })
    }

});



async function isGemOwner(req, res, next) {
    const gem = await gemsService.getOne(req.params.gemsId).lean();

    if (gem.owner != req.user?._id) {
        return res.redirect(`/gems/${req.params.gemsId}/details`);
    }

    req.gem = gem;
    next();
}

module.exports = router;