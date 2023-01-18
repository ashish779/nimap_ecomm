var con=require('./connection.js');
var express=require('express');
var app=express();
var bodyparser=require('body-parser');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.get("/",function(req,res){
res.sendFile(__dirname+'/addproduct.html');
});
// app.get("/addcategory",function(req,res){
//     res.sendFile(__dirname+'/addcategory.html');
//     });

app.set('View','ejs');



app.post('/addproductdetails',function(req,res){
var productname=req.body.Productname;
con.connect(function(error)
{
    var data;
    var sql="INSERT INTO productmaster(Productname)VALUES('"+productname+"')"; 
    con.query(sql,function(error,result){
        
      var output=result.insertId
        res.render(__dirname+'/addcategory.ejs', {data:output});

    })
})
});
app.post('/addcategorydetails',function(req,res){
  var categoryname = req.body.category;
  var productid=req.body.productid;
  con.connect(function(error)
  {
      
      var sql="INSERT INTO categorymaster(categoryname,productid)VALUES('"+categoryname+"','"+productid+"')"; 
      con.query(sql,function(error,result){
       
        res.redirect("/listdetails")
      })
  })
    });

    app.get('/listdetails',function(req,res)
{
con.connect(function(error){
    var sql='SELECT productmaster.Productid as productsid ,Productname,categoryid,categoryname,categorymaster.productid AS prodid FROM productmaster JOIN categorymaster ON productmaster.Productid = categorymaster.productid'
    con.query(sql,function(error,result){
        if(error) console.log(error)
        
res.render(__dirname+"/listdetails.ejs",{prolist:result})
   })
})
})
app.get('/delete_data',function(req,res)
{
    con.connect(function(error)
    {
        var sql='delete from productmaster where Productid=?';
        var id=req.query.id
        con.query(sql,[id],function(err,result)
        {
            if(err) console.log(err)
            res.redirect('/listdetails')
        });
    })

})

app.get('/edit_product',function(req,res)
{
    con.connect(function(error)
    {
        var sql="select * from productmaster where Productid =?";
        var id=req.query.id
        con.query(sql,[id],function(err,result){
            if(err)console.log(err)
            res.render(__dirname+'/update_product.ejs',{update_pro:result})
        })
    })
})

app.post('/update_product',function(req,res)
{
    var product=req.body.updateproductdata
    var id=req.body.updateproductid
    con.connect(function(err,result)
    {
        if(err) console.log(err)
        var sql='update productmaster set Productname=? where Productid =?'
        con.query(sql,[product,id],function(error,result)
        {
            if(error) console.log(error)
            res.redirect('/listdetails')
        })
    })
})










app.get('/edit_category',function(req,res)
{
    con.connect(function(error)
    {
        var sql="select * from  categorymaster where productid	 =?";
        var id=req.query.id
        con.query(sql,[id],function(err,result){
            if(err)console.log(err)
            res.render(__dirname+'/update_category.ejs',{update_category:result})
        })
    })
})






app.post('/update_category',function(req,res)
{
    var categoryname=req.body.updatecategory
    var id=req.body.updatecatproductid
    con.connect(function(err,result)
    {
        if(err) console.log(err)
        var sql='update categorymaster set categoryname=? where productid  =?'
        con.query(sql,[categoryname,id],function(error,result)
        {
            if(error) console.log(error)
            res.redirect('/listdetails')
        })
    })
})
app.listen('7000');