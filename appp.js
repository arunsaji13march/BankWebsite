const bodyParser = require('body-parser');
const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
let ejs = require('ejs');
 const path =require('path');
const { send } = require('process');
const prompt = require('prompt');   
const { brotliDecompress } = require('zlib');
const { url } = require('inspector');

dotenv.config({path: './.env'})

const app = express();
// app.use(express.static(path.join(__dirname,'files')));

var db = mysql.createConnection({
  host     :process.env.DATABASE_HOST,
  user     :process.env.DATABASE_USER ,
  password :process.env.DATABASE_PASSWORD,
  database :process.env.DATABASE 
});

const publicDirectory = path.join(__dirname,'./public');
app.use(express.static(publicDirectory));

app.set('view engine','ejs'); 
app.engine('ejs', require('ejs').__express);
//app.set('view engine', 'ejs');

db.connect( (error) => {
    if(error){
        console.log(error);
    }
    else{
        console.log("Mysql connected....");
    }
});

app.use('/',require('./routes/pages'));

//middleware
// create application/json parser
var jsonParser = bodyParser.json();
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

let accno,pass;
app.post('/values',urlencodedParser, (req,res) =>{
    // res.send('welcome, ' + (req.body.accno));
     accno = req.body.accno;
     pass =req.body.pass;
    console.log(typeof(accno), typeof(pass));
    

    db.query("select * from login where accno=? and pass=?",[accno,pass],(error,result)=>{
        if(error){
            console.log('error inquery');
             send("incorrect values bitch....");
        }

        else if(result.length > 0){
            // send('sucess....');
            console.log("result is not empty");
            console.log(result);
            db.query("select * from user where accno=?",[accno],(error,results1)=>{
                if(error){
                    console.log("Dtabase not connected....");
                }
                else{
                     console.log(results1);
              
                res.render("../views/welcome",{accno: results1[0].accno,name: results1[0].name,dob: 2021-results1[0].dob,email: results1[0].email,phone: results1[0].phone,address: results1[0].address});
                
                // pin=results1[0].pin;
                
            }
            

            });
            
            
            
        }

        else{
            res.send("no user exits");
        

        }
    });
    
});


app.get('/pin', (req,res)=>{
    res.render('pin');
})

app.post('/balance',urlencodedParser,(req,res)=>{
    pin=req.body.pin;
    db.query('select balance from user where accno=? and pin =?',[accno,pin],(error,result2)=>{
        if(error){
            console.log('error in balance query');

        }
        else if(result2.length>0){
            // console.log('render');
            
            res.render('index',{balance:result2[0].balance});
            
        }
        else{
            // console.log('incorrect value');
            res.send('incorrect pin...... ')
        }


    })
});

app.get('/transfer',(req,res)=>{
    res.render('index1');
    // console.log('transfer button clicked')
})

app.post('/transaction',urlencodedParser,(req,res)=>{
    let recieverAccno= req.body.raccno;
    let recieverName= req.body.rname;
    let recieverAmount = req.body.amount;
    let balance;
    
    db.query('select balance from user where accno=?',[accno],(error,result)=>{
        if(error){
            console.log('incorrect error');
        }
        else{
            balance=result[0].balance;
            console.log(balance);

            if(balance<recieverAmount){
                res.send('insufficient balance...');
            }
            else{
                db.query('update user set  user.balance =user.balance +? where accno=? and name=?',[recieverAmount,recieverAccno,recieverName],(error,result)=>{
                    if(error){
                        console.log('transfer query error...');
                        console.log(result);
                    }
                    else{
                        db.query('update user set  user.balance =user.balance -? where accno=?',[recieverAmount,accno,],(error,result)=>{
                            if(error){
                                console.log('error')
                            }
                            else{
                                res.send('sucessful TRANSACTION...........');
                            }
                        })
                      
                        console.log(result.affectedRows + " record(s) updated")
                    }
                }
                )
            }
        
            console.log(recieverAccno,recieverName,recieverAmount)
        }
    })

  
})


app.listen('3000',() =>{
    console.log('server started on port 5000');

});





// update user set  user.balance =user.balance +? where accno=?; update user set  user.balance =user.balance -? where accno=?',[recieverAmount,recieverAccno,recieverAmount,accno]