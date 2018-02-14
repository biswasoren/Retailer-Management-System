var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db =mongojs('Retail',['Login']);
var db1 =mongojs('Retail',['product']);

var bodyparser = require('body-parser');

app.use(express.static(__dirname + "/public"));
app.use(bodyparser.json());


app.post('/retailapp',function(req,res){
	
	name=req.body.name
	email=req.body.email
	pass=req.body.password
	console.log(name)
	console.log(req.body)

	if(!name || !email || !pass)
	{
		status="unsuccess";
		res.end(status);
	}
	if(name  && email  && pass )
	{
		db.Login.insert(req.body,function(err,docs){
			db.Login.update({name:req.body.name},{$set:{type:"customer",order:0}})
			db.createCollection(name,{})
			status="success";
			res.end(status);
		});
	}

});


		


app.post('/retailapp/login',function(req,res){
	
     

     db.Login.find(  {$and: [{name:req.body.name,password:req.body.password,type:req.body.type}]},{name:1,password:1,type:1,_id:0}

     	,function(err,doc){
     		console.log(doc)
     	if(doc.length == 0){
     		status="unsuccess";
		res.json(doc);
     	}

     	else{
     		status="success";
		res.json(doc);
		
     	}
     	
     });


}); 

app.post('/Biscuits',function(req,res){

 	db.product.find({category:"Biscuits"},{},function(err,doc)
 	{

 		console.log(doc.length);
 		res.json(doc);
 	})


 });

 app.post('/cart/:id/:name',function(req,res){
 	id=req.params.id;
 	user=req.params.name;
 	
 	db.product.find({_id:mongojs.ObjectId(id)},{name:1,price:1,stock:1,_id:1}

     	,function(err,doc){
     		
     		db.product.update( { _id:mongojs.ObjectId(id) },{ $set: { cart: "added" } })
 	        db[user].insert(doc,function(err,docs){
			status="success";
			
			
			res.end(status);
		})
 	})

 });

app.post('/rem/:id/:user',function(req,res){
	
	id=req.params.id;
	user=req.params.user;
	db[user].remove( { _id:mongojs.ObjectId(id) },function(err,doc){
		
		
		db.product.update( { _id:mongojs.ObjectId(id) },{ $set: { cart: "not" } })
		
		res.end("status");
	})

})

app.post('/plus/:id/:name/:total',function(req,res){
	id=req.params.id;
	user=req.params.name;
	
	total=req.params.total;
	db[user].find( { _id:mongojs.ObjectId(id)},{price:1,_id:0},function(err,doc){
		
		
		
		db[user].update( { _id:mongojs.ObjectId(id)},{ $inc: { count:1 }},function(err,docs){
			db[user].find(  { _id:mongojs.ObjectId(id)},{count:1,_id:0},function(err,d){

			db[user].update(  { _id:mongojs.ObjectId(id)},{ $set: { total:doc[0].price*d[0].count }})
			})
		})
		res.json(doc);
	})

})

app.post('/minus/:id/:name/:total',function(req,res){
	id=req.params.id;
	user=req.params.name;
	
	total=req.params.total;
	db[user].find( { _id:mongojs.ObjectId(id)},{price:1,_id:0},function(err,doc){
		
		
		
		db[user].update( {$and:[{ _id:mongojs.ObjectId(id),count:{$gt:0}}]},{ $inc: { count:-1 }},function(err,docs){
			db[user].find( { _id:mongojs.ObjectId(id)},{count:1,_id:0},function(err,d){
				res.json(d);
			db[user].update( { _id:mongojs.ObjectId(id)},{ $set: { total:doc[0].price*d[0].count }})
			})
		})
		
	})

})





app.get('/products',function(req,res){

	db1.product.find({},{name:1,price:1,stock:1,cart:1,_id:1}

     	,function(err,doc){

     		
     		res.json(doc);

     });


	});


app.get('/incart/:name',function(req,res){
	name=req.params.name
	db[name].find({},{name:1,price:1,count:1,total:1,_id:1}

     	,function(err,doc){

     		
     		res.json(doc);

     });


	});

app.get('/logout',function(req,res)
{
	db.product.update({},{$set:{cart:"not"}},{ multi: true },function(res,doc)
	{
		console.log("done")
	})

	

})

app.get('/checkout/:name/:add',function(req,res)
{	user=req.params.name;
	address=req.params.add
	console.log(address)
	db.Login.update({name:user},{$inc:{order:1}},function(err,doc){
	db[user].find({}).forEach(function(err,doc){
		if(err) throw err;
		if(doc){
		
		db.Login.find({name:user},{order:1,address:1,_id:0},function(err,docs){
			
			db.orders.insert({orderid:docs[0].order,name:doc.name,count:doc.count,total:doc.total,price:doc.price,user:user,status:"active",address:address,phone:docs[0].phone},function(err,doc)
			{
			
			console.log(doc.count)



			db.product.update({name:doc.name},{$inc:{stock:-doc.count}},function(res,doc)
			{
				
				db[user].remove({});
			})

				
		       
			})
			
		})

		}
		})
	})
	
	res.end("confirm")

})

app.get('/checkout1/:name',function(req,res)
{	user=req.params.name;
	db.Login.update({name:user},{$inc:{order:1}},function(err,doc){
	db[user].find({}).forEach(function(err,doc){
		if(err) throw err;
		if(doc){
		
		db.Login.find({name:user},{order:1,address:1,phone:1,_id:0},function(err,docs){
			
			db.orders.insert({orderid:docs[0].order,name:doc.name,count:doc.count,total:doc.total,price:doc.price,user:user,status:"active",address:docs[0].address,phone:docs[0].phone},function(err,doc)
			{
			
			console.log(doc.count)



			db.product.update({name:doc.name},{$inc:{stock:-doc.count}},function(res,doc)
			{
				
				db[user].remove({});
			})

				
		       
			})
			
		})

		}
		})
	})
	
	res.end("confirm")

})

app.post('/addp',function(req,res){

	db.product.insert({name:req.body.name,price:req.body.price,stock:parseInt(req.body.stock),category:req.body.category,cart:"not"},function(err,doc){
		
		res.end("done")
	})

})

app.post('/deletep/:id',function(req,res){
	id=req.params.id
	db.product.remove({_id:mongojs.ObjectId(id)},function(err,doc){
		
		res.end("done")
	})

})
app.get('/editp/:id',function(req,res){
	id=req.params.id
	db.product.findOne({_id:mongojs.ObjectId(id)},function(err,doc){
		
		res.json(doc)
	})

})


app.put('/updatep/:id',function(req,res){
	id=req.params.id

	db.product.findAndModify({query:{_id:mongojs.ObjectId(id)},
		update:{$set:{name:req.body.name,price:req.body.price,stock:req.body.stock,category:req.body.category}}},function(err,doc){
			res.json(doc)
		})
	})




app.get('/view',function(req,res){

	db1.product.find({},{name:1,price:1,stock:1,category:1,_id:1}

     	,function(err,doc){

     		
     		res.json(doc);

     });


	});

 app.get('/od/:name',function(req,res){
user=req.params.name
 	db.Login.find({name:user},{order:1,_id:0},function(err,doc)
 	{	console.log(doc)
 		db.orders.find({$and:[{orderid:doc[0].order,user:user}]},{},function(err,doc)
 		{
 		console.log(doc)
 		res.json(doc);
 		})
 	})


 })



 app.get('/or/:name',function(req,res){
user=req.params.name
 	
 		db.orders.find({user:user},{},function(err,doc)
 		{
 		console.log(doc)
 		res.json(doc);
 		})
 	


 })


app.get('/sor/:name',function(req,res){
user=req.params.name
 	
 		db.orders.find({},function(err,doc)
 		{
 		console.log(doc)
 		res.json(doc);
 		})
 	


 })

app.get('/profile/:name',function(req,res){
user=req.params.name
 	
 		db.Login.find({name:user},{},function(err,doc)
 		{
 	
 		res.json(doc);
 		})
 	


 })





app.put('/update/:id/:status',function(req,res){
	id=req.params.id
	status=req.params.status
	db.orders.findAndModify({query:{_id:mongojs.ObjectId(id)},
		update:{$set:{status:status}}},function(err,doc){
			res.json(doc)
		})
	})

app.post('/cancel/:id',function(req,res){
	id=req.params.id
	
	db.orders.update({_id:mongojs.ObjectId(id)},
		{$set:{status:"Cancel"}},function(err,doc){
			db.orders.findOne({_id:mongojs.ObjectId(id)},function(err,docs)
			{
				console.log(docs.name)
				db.product.update({name:docs.name},{$inc:{stock:docs.count}})


				
			res.json(doc)
			})
			
		})
	})

app.post('/return/:id',function(req,res){
	id=req.params.id
	
	db.orders.update({_id:mongojs.ObjectId(id)},
		{$set:{status:"Return"}},function(err,doc){
			res.json(doc)
		})
	})

app.post('/save/:id',function(req,res)
{
	id=req.params.id
	db.Login.update({name:id},{$set:{address:req.body.address,email:req.body.email,phone:req.body.phone}},function(err,doc)
	{
		res.json(doc)
	})
})




app.listen(3000);
console.log("server running on 3000");