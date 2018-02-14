/**
 * Created by RAJesh1 on 6/22/2016.
 */

// OR commonjs style
//var angularMaterialize = require('angular-materialize');

angular.module('myModule', ['ui.router'])

    .config(function($stateProvider,  $urlRouterProvider) {
            var source="";
        $stateProvider
            .state('homePage', {
                url: '/homePage',
                templateUrl: source + '/home.html',
                controller: 'homePageCtrl',

            })
            

            .state('login', {
                url: '/login',
                templateUrl: source + '/login.html',
                controller: 'logctrl',

            })

            .state('loginunsuccess', {
                url: '/login/unsuccess',
                templateUrl: source + '/loginunsuccess.html',
                controller: 'logctrl',

            })

             .state('shop', {
                url: '/shop',
                templateUrl: source + '/shop.html',
                controller: 'shopctrl',

            })

             .state('signed', {
                url: '/signed',
                templateUrl: source + '/signed.html',
                controller: 'logctrl',

            })

             .state('signunsuccess', {
                url: '/signunsuccess',
                templateUrl: source + '/signunsuccess.html',
                controller: 'logctrl',

            })

             .state('cart', {
                url: '/cart',
                templateUrl: source + '/cart.html',
                controller: 'cartctrl',

            })

            .state('logout', {
                url: '/logout',
                templateUrl: source + '/logout.html',
                controller: 'logoutctrl',

            })      

             .state('checkout', {
                url: '/checkout',
                templateUrl: source + '/checkout.html',
                controller: 'checkctrl',

            })          

            .state('admin', {
                url: '/admin',
                templateUrl: source + '/admin.html',
                controller: 'adminctrl',

            })                

            

              .state('viewproducts', {
                url: '/viewproducts',
                templateUrl: source + '/viewproducts.html',
                controller: 'viewproductctrl',

            })    


               .state('orderdetails', {
                url: '/orderdetails',
                templateUrl: source + '/orderdetails.html',
                controller: 'orderdetails',

            })  

            .state('orders', {
                url: '/orders',
                templateUrl: source + '/orders.html',
                controller: 'orders',

            })    

            .state('showorders', {
                url: '/showorders',
                templateUrl: source + '/showorders.html',
                controller: 'showorders',

            })  

            .state('profile', {
                url: '/profile',
                templateUrl: source + '/profile.html',
                controller: 'profile',

            })    



            .state('edit', {
                url: '/edit',
                templateUrl: source + '/editprofile.html',
                controller: 'edit',

            })    
            
//        $urlRouterProvider.otherwise('/homePage')
    })



    .controller('homePageCtrl', function ($scope ,$state, $http) {
       

        $scope.login=function() {
            console.log("i am inside log in");
            $state.go('login');

       }

    })

   .controller('logctrl', function ($scope ,$state, $http) {
            console.log("i am inside loginCtrl");

            $scope.id={};
            $scope.loginfunc = function(){
                console.log($scope.id.name);


                localStorage.setItem('name',$scope.id.name);


                $http.post('/retailapp/login',$scope.id).success(function(response){
                    console.log(response.length)
                if (response.length != "0")
                {
                    console.log(response);
                    console.log("succesfully logged");
                    if(response[0].type=="customer"){
                    $state.go('shop');}
                    if(response[0].type=="admin"){
                    $state.go('admin');
                    console.log("admin bc");}

                }

                if (response.length === 0)
                {
                    console.log(response);
                    console.log("NOT succesfully logged");
                    $state.go('loginunsuccess');
                }

                
                });

            }

            $scope.retry=function(){

                $state.go('login');

            }

            $scope.s={};
            $scope.addid = function(){
                
                    

                $http.post('/retailapp',$scope.s).success(function(response){

                    if (response === "success")
                    {
                    console.log(response);
                    console.log("succesfully signed");
                    $state.go('signed');
                    }

                    if (response === "unsuccess")
                    {
                    console.log(response);
                    console.log("NOT succesfully signed");
                    $state.go('signunsuccess');
                    }
                });


                }
            
        

   })

     .controller('shopctrl', function ($scope ,$state, $http) {

            console.log("I am inside shopctrl")

            $scope.products={}

            var refresh=function(){
            $http.get('/products').success(function(response){


                console.log("GET request sent");
                console.log(response);
                
                $scope.user = localStorage.getItem('name');
                $scope.products=response;

           })     
        }
            
            refresh();
         $scope.b={}; 

         $scope.gotoprofile =function()
         {
            $state.go("profile")

         }

          $scope.gotoshop =function()
         {
            $state.go("shop")
            refresh();

         }
         
        $scope.Biscuits = function(){
                
                    

                $http.post('/Biscuits').success(function(response){

                 if (response)
                    {
                    console.log(response);
                    console.log("mila nai");
                    $scope.products=response;
                    
                    }

                    
                });


                }
        $scope.cart={};
            
        $scope.addtocart = function(id,name){
                
                
                console.log(id);
                  
                $http.post('/cart/'+ id +'/'+ name).success(function(response){

                   
                   
                    refresh();

                    
                });


                }

                

        $scope.removefromcart = function(id,user){

            $http.post('/rem/' + id +'/'+ user).success(function(response){


                console.log("success");

                refresh();


            });
        }

        
        $scope.gotocart = function(){

            $state.go('cart');
        }

        $scope.gotoorders =function(){
            $state.go('orders');
        }

     

     $scope.logout = function(){

            

            $http.get('/logout',function(response)
            {
               console.log(response) ;
               

            })
             $state.go("logout");
     } 
       


        })

           


     


.controller('cartctrl', function ($scope ,$state, $http) {

            console.log("I am inside cartctrl")

            $scope.cartproducts={}
             $scope.user = localStorage.getItem('name');
            var refresh=function(){
            $http.get('/incart/'+ $scope.user).success(function(response){


                console.log("GET request sent");
                console.log(response);
                $scope.total=0;
                $scope.user = localStorage.getItem('name');
                $scope.cartproducts=response;
                for (var i =response.length - 1; i >= 0; i--) {
                   $scope.total=$scope.total+response[i].total;
                }

           })     
        }

        refresh();

       

           
$scope.total=0;
   $scope.count = 0;
            price={}
  $scope.plus = function(id,name) {
    
    
 
            
    $http.post('/plus/'+ id+ '/' + name + '/' + $scope.total).success(function(response){

                price=response;
                p=price[0].price;
               
                refresh();
           })     

  };
  $scope.minus = function(id,name) {
    
$http.post('/minus/'+ id+ '/' + name + '/' + $scope.total).success(function(response){

                price=response;
            
               
                refresh();
           }) 
  };
        


        $scope.logout = function(){

            $state.go('logout');

            $http.get('/logout').success(function(response)
            {
               console.log(response);
               

            })
        };


        $scope.checkout =function(){

            $state.go('checkout');


        }

        $scope.gotoshop =function(){

            $state.go('shop');


        }

         $scope.removefromcart = function(id,user){

            $http.post('/rem/' + id +'/'+ user).success(function(response){


                console.log("success");

                refresh();


            });
        }



     }) 

    


.controller('logoutctrl', function ($scope ,$state, $http) {
       

        $scope.home=function() {
            
            $state.go('homePage');

       }

    })

.controller('checkctrl', function ($scope ,$state, $http) {
       
 $scope.user = localStorage.getItem('name');
        $scope.cd=function(id,add) {
            
           if(id!="use"){
            console.log(add)
          $http.get('/checkout/'+$scope.user+'/'+add).success(function(response)
            {
               console.log(response);
               $state.go('orderdetails')
               
               
            }) 
      }

      if(id=="use"){
          $http.get('/checkout1/'+$scope.user).success(function(response)
            {
               console.log(response);
               $state.go('orderdetails')
               
               
            }) 
      }
             $http.get('/logout',function(response)
            {
               console.log(response) ;
               

            })
       }




       $scope.gotocart = function(){

            $state.go('cart');
        }
    })


.controller('adminctrl', function ($scope ,$state, $http) {
       
 $scope.user = localStorage.getItem('name');

    $scope.gotoadd = function(){

        $state.go('viewproducts');
    }


    $scope.gotoshow = function(){

        $state.go('showorders');
    }
       

    $scope.adminout = function(){

        localStorage.removeItem('name');
        $state.go('homePage');
    }
       
    })    




.controller('viewproductctrl', function ($scope ,$state, $http) {
       


    

        var refresh = function(){
            $http.get('/view').success(function(response){

            $scope.products=response
            $scope.p=""
        })
        }

        refresh();
       
     $scope.addp = function(){

        $http.post('/addp',$scope.p).success(function(response){
            console.log(response)
            refresh();

        })
        
    }

    $scope.deletep = function(id){

        $http.post('/deletep/'+id).success(function(response){
            console.log(response)
            refresh();

        })
        
    }
     $scope.editp = function(id){

        $http.get('/editp/'+id).success(function(response){
           
            $scope.p=response;

        })
        
    }
       
 $scope.updatep = function(){

        $http.put('/updatep/'+$scope.p._id,$scope.p).success(function(response){
           alert('succesfully updated');
           refresh();

        })
        
    }

    $scope.gotoadd = function(){

        $state.go('admin');
    }

    $scope.adminout = function(){

        localStorage.removeItem('name');
        $state.go('homePage');
    }
       

    })  


.controller('orderdetails', function ($scope ,$state, $http) {

 $scope.user = localStorage.getItem('name');
     var refresh = function(){
            $http.get('/od/'+$scope.user).success(function(response){
                console.log(response)
            $scope.orders=response
            
        })
        }

        refresh();

         $scope.gotoshop = function(){

            $state.go('shop');
        }


 $scope.logout = function(){

            $state.go('logout');

            $http.get('/logout',function(response)
            {
               console.log(response) ;
               $state.go("logout");

            })
        }


       

})


.controller('orders', function ($scope ,$state, $http) {

 $scope.user = localStorage.getItem('name');
     var refresh = function(){
            $http.get('/or/'+$scope.user).success(function(response){
                console.log(response)
            $scope.orders=response
            
        })
        }

        refresh();

         $scope.gotoshop = function(){

            $state.go('shop');
        }

        $scope.cancel = function(id){

            $http.post('/cancel/'+id).success(function(response)
            {
                refresh();
            })
        }

        $scope.return = function(id){

            $http.post('/return/'+id).success(function(response)
            {
                refresh();
            })
        }

         



 $scope.logout = function(){

            $state.go('logout');

            $http.get('/logout',function(response)
            {
               console.log(response) ;
               $state.go("logout");

            })
        }


       

})



.controller('showorders', function ($scope ,$state, $http) {

 $scope.user = localStorage.getItem('name');
     var refresh = function(){
            $http.get('/sor/'+$scope.user).success(function(response){
                console.log(response)
            $scope.orders=response
            
        })
        }

        refresh();

         $scope.gotoshop = function(){

            $state.go('admin');
        }


        $scope.update =function(id,status)
        {
            
            console.log(status)
             $http.put('/update/'+id+'/'+status).success(function(response){
           
           refresh();

        })
        }


 $scope.logout = function(){

            $state.go('logout');

            $http.get('/logout',function(response)
            {
               console.log(response) ;
               $state.go("adminout");

            })
        }


       

})



.controller('profile', function ($scope ,$state, $http) {

 $scope.user = localStorage.getItem('name');
     var refresh = function(){
            $http.get('/profile/'+$scope.user).success(function(response){
                console.log(response)
            $scope.profile=response
            
        })
        }

        refresh();

         $scope.gotoedit = function(){

            $state.go('edit');
        }

        $scope.gotoshop = function(){

            $state.go('shop');
        }

        $scope.gotocart = function(){

            $state.go('cart');
        }



 $scope.logout = function(){

            $state.go('logout');

            $http.get('/logout',function(response)
            {
               console.log(response) ;
               $state.go("adminout");

            })
        }


       

})

.controller('edit', function ($scope ,$state, $http) {

 $scope.user = localStorage.getItem('name');
     var refresh = function(){
            $http.get('/profile/'+$scope.user).success(function(response){
                console.log(response)
            $scope.profile=response
            
        })
        }

        refresh();

         $scope.gotoprofile = function(){
                $state.go('profile');
            
        }

        $scope.save =function(ob){

            $http.post('/save/'+$scope.user,ob[0]).success(function(response)
            {

                $state.go('profile');
            })

        }



 $scope.logout = function(){

            $state.go('logout');

            $http.get('/logout',function(response)
            {
               console.log(response) ;
               $state.go("adminout");

            })
        }


       

})
