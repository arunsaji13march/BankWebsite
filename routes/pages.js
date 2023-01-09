const exp=require('express');
const router=exp.Router();


router.get('/',(req,res)=>{
    res.render('index');
})

router.get('/transfer',(req,res)=>{
    res.render('transfer');
})

module.exports=router;