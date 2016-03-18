var mysql = require('mysql');
var ejs=require('ejs');

var fs = require('fs');
var dataForShowing= new Array();
var dataForShowing1= new Array();
ContactID=[];
var passport = require('passport');
var Success='';
var Tag1='';
var Tag2='';
var poolH     =    mysql.createPool({
                                    connectionLimit : 100, //important
                                    host     : 'localhost',
                                    user     : 'Xig514',
                                    password : 'some_pass',
                                    database : 'Hunsicker',
                                    debug    :  false
                                    });
function checkMoreThanTwice(array,element)
{
    var count=0;
    for(var i = 0 ; i < array.length;i++)
    {
        //console.log("array    " + array);
       // console.log("element   "+element);
        if(array[i]==element)
        {
           // console.log("==" )
            count++;
            if(count>=1) break;
        }
    }
    if(count>=1)
        return 1;
    else
        return 0;
}

exports.show= function(req,res){
    
  /*  if(req.isAuthenticated())
    { if (req.user ==undefined)
    {
        console.log('authed in show and req.user = undefined');
        res.render('errorPage', {usernameE: 'unknown',h1:'Error: Unknown User',errorMessage :'unKnown User',title:'Error: Unknown User'});
        
    }else{
        var user = req.user;
        user.toJSON();
        //console.log(user.username);
        res.render('passwordChange',{ h1:'Change Password', title:'Change Password',username: req.params.id});
    }
    }
    else*/
    
    //console.log(req.query.Success);
    Success='';
    if(req.query.tag1!=undefined){
    Tag1 = req.query.tag1;
        console.log("in show tag 1"+ Tag1);
    }
    if(req.query.tag2!=undefined){
        Tag2 = req.query.tag2;
        console.log("in show  tag 2"+ Tag2);
    }
    if (req.query.Success!=undefined) {
    if(req.query.Success=='MNBHUYHHHNNNJK1231')
    {Success='Successfully update the Contact!';
        console.log(Success);
    }
    else if (req.query.Success=='MNBHUYHHHNNNJK1232'){
    Success='Successfully update the Company!';
    }
    }
    console.log(Success+'11');
    username= req.params.id;
    countCompany=0;
    //console.log(username);
       poolH.getConnection(function(err,connection){
                       
                        if (err) {
                        connection.release();
                        res.json({"code" : 100, "status" : "Error in connection database"});
                        return;
                        }
                        //queryClause = "Select ContactID As Solution From user_Contact;";
                        queryClause="Select ContactID As Solution From user_Contact Where username = "+connection.escape(username)+";";
                        connection.query(queryClause,function(err,rows){
                                         
                                         if(!err)
                                         {
                                         if(rows[0]!=null && rows[0].Solution!= undefined)
                                         {
                                         
                                         for(var i =0; i<1000;i++)
                                         // while(rows[i]!=null && rows[i].Solution !=undefined )
                                         {
                                         
                                         if(rows[i]==null || rows[i].Solution==undefined)
                                         {
                                         break;
                                         }
                                         
                                         
                                         //console.log('i   =' +i);
                                         ContactID[i]= rows[i].Solution;
                                         //console.log('ContactID = ' +ContactID[i]);

                                         }
                                         
                                         ContactCount=ContactID.length;
                                        // console.log("ContactLength is " + ContactCount);
                                         //so now we have the ContactID and we want to get the ContactName, Contact Phone, and Address.
                                         var queryClause2 = "Select ContactID as coni,CompanyID as ci, FirstName As fn, LastName As ln, PhoneNumber As pn, SiteAddress As sa, EmailAddress as ea, SiteCity as sc, SiteState as ss, SiteZip as sz, ContactStatusID as csid From Contact Where ContactID = ";
                                         for (var i =0;i<ContactCount;i++)
                                         {
                                         if(ContactID[i]!=undefined)
                                         queryClause2=queryClause2+connection.escape(ContactID[i]);
                                         if(ContactID[i+1]==undefined)
                                         {
                                         queryClause2=queryClause2+" ; ";
                                         
                                         
                                         }
                                         else queryClause2=queryClause2+" Or ContactID = ";
                                         }
                                         //console.log(queryClause2);//correct
                                         connection.query(queryClause2,function(err,rows,fields){
                                                          
                                                          if(!err){
                                                          //console.log('successfully get the contact info');
                                                          //var fieldsCount = fields.length;
                                                        //  if(rows[0]!=null && rows[0].Solution!= undefined){
                                                          for(var i =0; i <ContactCount ; i++)
                                                          {
                                                          if (rows[i]!=null && rows[i].fn!= undefined)
                                                          {
                                                         
                                                          
                                                          dataForShowing[i]=new Array(11);
                                                          dataForShowing[i][0]=rows[i].coni;
                                                          
                                                          dataForShowing[i][1]=rows[i].fn;
                                                          dataForShowing[i][2]=rows[i].ln;
                                                          dataForShowing[i][3]=rows[i].pn;
                                                          dataForShowing[i][4]=rows[i].ea;
                                                          dataForShowing[i][5]=rows[i].sa;
                                                          
                                                          dataForShowing[i][6]=rows[i].sc;
                                                          dataForShowing[i][7]=rows[i].ss;
                                                          dataForShowing[i][8]=rows[i].sz;
                                                          dataForShowing[i][9] = rows[i].ci;
                                                          dataForShowing[i][10]=rows[i].csid;
                                                          countCompany++;
                                                          }
                                                          }//end for(var i =0; i <ContactCount ; i++)
                                                         // console.log(dataForShowing);
                                                          CompanyID = new Array (countCompany)
                                                          DistinctCompanyID= new Array();
                                                          //console.log()
                                                          for (var i =0;i<countCompany;i++)
                                                          {
                                                          CompanyID[i]=dataForShowing[i][9];
                                                          //console.log('CompanyID'+CompanyID[i]);
                                                          if( checkMoreThanTwice (DistinctCompanyID,CompanyID[i])){}
                                                          else{DistinctCompanyID.push(CompanyID[i]);}
                                                          }
                                                          
                                            
                                                          
                                                          queryClause3 = "Select CompanyID as ci, CompanyName as cn, BillingAddress as ba, BillingCity as bc, BillingState as bs, BillingZip as bz, BillingContactFirstName as bcfn, BillingContactLastName as bcln,BillingContactEmail as bce, BillingContactPhone as bcp, CompanyStatusID as csid From Company WHERE CompanyID = ";
                                                          
                                                          for (var i =0;i<DistinctCompanyID.length;i++)
                                                          {
                                                          if(DistinctCompanyID[i]!=undefined)
                                                          queryClause3=queryClause3+connection.escape(DistinctCompanyID[i]);
                                                          if(DistinctCompanyID[i+1]==undefined)
                                                          {
                                                          queryClause3=queryClause3+" ; ";
                                                          
                                                          
                                                          }
                                                          else queryClause3=queryClause3+" Or CompanyID = ";
                                                          }
                                                          //console.log(queryClause3);
                                                          connection.query(queryClause3,function(err,rows,fields){
                                                                           connection.release();
                                                                           if(!err)
                                                                           {
                                                                           for(var i =0; i <DistinctCompanyID.length ; i++)
                                                                           {
                                                                           if (rows[i]!=null && rows[i].ci!= undefined)
                                                                           {
                                                                           
                                                                           
                                                                           dataForShowing1[i]=new Array(11);
                                                                           dataForShowing1[i][0]=rows[i].ci;
                                                                           
                                                                           dataForShowing1[i][1]=rows[i].cn;
                                                                           dataForShowing1[i][2]=rows[i].ba;
                                                                           dataForShowing1[i][3]=rows[i].bc;
                                                                           dataForShowing1[i][4]=rows[i].bs;
                                                                           dataForShowing1[i][5]=rows[i].bz;
                                                                           dataForShowing1[i][6]=rows[i].bcfn;
                                                                           dataForShowing1[i][7]=rows[i].bcln;
                                                                           dataForShowing1[i][8]=rows[i].bce;
                                                                           dataForShowing1[i][9] = rows[i].bcp;
                                                                           dataForShowing1[i][10] = rows[i].csid;
                                                                           }
                                                                           else{console.log("no company records");
                                                                           return;}
                                                                           }

                                                                           //console.log("ContactCount"+ContactCount);
                                                                           //console.log("CompanyCount"+DistinctCompanyID.length);
                                                                           for (var i =0;i<DistinctCompanyID.length;i++){
                                                                           //console.log(DistinctCompanyID[i]);
                                                                           }
                                                                          // console.log(Success+"1111");
                                                                           if(Success=='')
                                                                           {
                                                                           if(Tag1=='' )
                                                                           {
                                                                           if(Tag2==''){
                                                                           
                                                            
                                                                           res.render('updateContactInfomation1', {numberRowsE:ContactCount,numberFieldsE:11,numberRowsE1:DistinctCompanyID.length, numberFieldsE1: 11,dataForShowingE:dataForShowing,dataForShowingE1:dataForShowing1,username:username});
                                                                           }
                                                                           else{
                                                                           res.render('updateContactInfomation1', {numberRowsE:ContactCount,numberFieldsE:11,numberRowsE1:DistinctCompanyID.length, numberFieldsE1: 11,dataForShowingE:dataForShowing,dataForShowingE1:dataForShowing1,username:username,tag2:Tag2});
                                                                           }
                                                                           
                                                                           }
                                                                           else
                                                                           {
                                                                           if(Tag2=='')
                                                                           res.render('updateContactInfomation1', {numberRowsE:ContactCount,numberFieldsE:11,numberRowsE1:DistinctCompanyID.length, numberFieldsE1: 11,dataForShowingE:dataForShowing,dataForShowingE1:dataForShowing1,username:username,tag1:Tag1});
                                                                           else
                                                                           
                                                                           res.render('updateContactInfomation1', {numberRowsE:ContactCount,numberFieldsE:11,numberRowsE1:DistinctCompanyID.length, numberFieldsE1: 11,dataForShowingE:dataForShowing,dataForShowingE1:dataForShowing1,username:username,tag1:Tag1,tag2:Tag2});
                                                                           
                                                                           }
                                                                           }
                                                                           else{
                                                                           if(Tag1==''){
                                                                           //console.log('something here'+Success+"11");
                                                                           if(Tag2=='')
                                                                           res.render('updateContactInfomation1', {numberRowsE:ContactCount,numberFieldsE:11,numberRowsE1:DistinctCompanyID.length,    numberFieldsE1: 11,dataForShowingE:dataForShowing,dataForShowingE1:dataForShowing1,username:username,SuccessE:Success});
                                                                           else{
                                                                           res.render('updateContactInfomation1', {numberRowsE:ContactCount,numberFieldsE:11,numberRowsE1:DistinctCompanyID.length,    numberFieldsE1: 11,dataForShowingE:dataForShowing,dataForShowingE1:dataForShowing1,username:username,SuccessE:Success,tag2:Tag2});
                                                                           }
                                                                           }
                                                                           else{
                                                                           if(Tag2=''){
                                                                           res.render('updateContactInfomation1', {numberRowsE:ContactCount,numberFieldsE:11,numberRowsE1:DistinctCompanyID.length,    numberFieldsE1: 11,dataForShowingE:dataForShowing,dataForShowingE1:dataForShowing1,username:username,SuccessE:Success,tag1:Tag1});
                                                                           }
                                                                           else{
                                                                           res.render('updateContactInfomation1', {numberRowsE:ContactCount,numberFieldsE:11,numberRowsE1:DistinctCompanyID.length,    numberFieldsE1: 11,dataForShowingE:dataForShowing,dataForShowingE1:dataForShowing1,username:username,SuccessE:Success,tag1:Tag1,tag2:Tag2});
                                                                           }
                                                                           }
                                                                           }
                       
                                                          }//end if(!err)
                                                          else{
                                                          console.log('error in Select CompanyInfo!');
                                                          
                                                                           res.render('errorPage', {usernameE: username,h1:'Error in Select Company Infomation',title:"Error in Select ComapnyInfo",errorMessage :'Error in Select CompanyInfo!'});
                                                          return;
                                                      }
                                                
                                                    });
                                                          }
                                                          else{
                                                          console.log('error in Select Contact Information!');
                                                          
                                                          res.render('errorPage', {usernameE: username,h1:"Error in Select Contact Information",title:"Error in Select Contact Information",errorMessage :'Error in Select Contact Information!'});
                                                          return;
                                                          }});
                                         }
                                         else
                                         {
                                         console.log('no such contact for you');
                                                          
                                         res.render('updateContactInfomation1', {username:username,numberRowsE:0,numberFieldsE:0,numberRowsE1:0,dataForShowingE:dataForShowing,dataForShowingE1:dataForShowing1,errorMessage: 'No Contact records for you. Please input the Contact information First.'});
                                         
                                         }
                                        }
                                         
                                         else{
                                         console.log('error in Select ContactID!');
                                        
                                         res.render('errorPage', {usernameE: username,h1:"Error in Select Contact Information",title:"Error in Select ContactID",errorMessage :'Error in Select ContactID!'});
                                         return;
                                         
                                         }
                                         
                                         });
                        //-------------------------------------------------------------------------
                        connection.on('error', function(err) {res.json({"code" : 100, "status" : "Error in connection database"});return;});
                        
                        
    
    

                        });
                        
/*
    {
        fs.readFile(template, function(err, data) {
                    var aa = "Login";
                    var title = "Login";
                    var again1= "Session Expired";
                    var output = ejs.render(data.toString(), {h1: aa, title:title ,again:again1});//,urlLink:url});
                    //response.setHeader('Content-type', 'text/html');
                    res.end(output);
                    });
    }
*/
    
}


exports.update=function(req,res){
    username= req.params.id;
    var tag1= req.body.tag1;
    if(req.query.key=='Contact'){
        
    
    var category = req.body.FieldName;
    var ContactID = req.body.ContactID;
        var newValue  ={};
        newValue[category]=req.body.new;
        //console.log(ContactID);
        //console.log(newValue);
    
        poolH.getConnection(function(err,connection){
                            if (err) {
                            connection.release();
                            res.json({"code" : 100, "status" : "Error in connection database"});
                            return;
                            }
                            //queryClause = "Select ContactID As Solution From user_Contact;";
                            queryClause="Update Contact set ? Where ContactID = "+connection.escape(ContactID)+";";
                            connection.query(queryClause, newValue,function(err,rows){
                                             if(!err)
                                             {
                                             console.log('tag1=  '+tag1);
                                             res.redirect('/updateContactInformation/'+username+'?Success=MNBHUYHHHNNNJK1231&tag1='+tag1);
                                             
                                             }
                                             else
                                             {
                                             console.log('error in Update Contact!');
                                             
                                             res.render('errorPage', {usernameE: username,h1:"Error in Update Contact Information",title:"Error in Update ContactID",errorMessage :'Error in Update ContactID!'});
                                             return;
                                             

                                             }
                                             
                                             
                                             });
                                             connection.on('error', function(err) {res.json({"code" : 100, "status" : "Error in connection database"});return;});
                            });
    }
    else{
        var category = req.body.FieldName1;
        var CompanyID = req.body.CompanyID;
        var newValue  ={};
        newValue[category]=req.body.new1;
        console.log(CompanyID);
        console.log(newValue);
        var tag2= req.body.tag2;
        poolH.getConnection(function(err,connection){
                            if (err) {
                            connection.release();
                            res.json({"code" : 100, "status" : "Error in connection database"});
                            return;
                            }
                            //queryClause = "Select ContactID As Solution From user_Contact;";
                            queryClause="Update Company set ? Where CompanyID = "+connection.escape(CompanyID)+";";
                            connection.query(queryClause, newValue,function(err,rows){
                                             if(!err)
                                             {
                                             res.redirect('/updateContactInformation/'+username+'?Success=MNBHUYHHHNNNJK1232&tag2='+tag2);
                                             }
                                             else
                                             {
                                             console.log('error in Update Company!');
                                             
                                             res.render('errorPage', {usernameE: username,h1:"Error in Update Company Information",title:"Error in Update Company",errorMessage :'Error in Update Company!'});
                                             return;
                                             
                                             
                                             }
                                             
                                             
                                             });
                            connection.on('error', function(err) {res.json({"code" : 100, "status" : "Error in connection database"});return;});
                            });

    }
}
