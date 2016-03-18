var mysql = require('mysql');
var ejs = require('ejs');
var title = 'Administrator Add New Job';


var poolH = mysql.createPool({
                             connectionLimit : 100, //important
                             host     : 'localhost',
                             user     : 'Xig514',
                             password : 'some_pass',
                             database : 'Hunsicker',
                             debug    :  false
                             

                             });

exports.show=function (request,response)
{
    var user={username:'Administer'};
    response.render('addNewJobAdmin',{user:user,title:title})
    
}


exports.handle_Selection=function (req,res)
{
    var dataForShowing1=new Array();
    var choice = req.body.Company;
    if(choice ==1){//existing
        poolH.getConnection(function(err,connection){
                            if (err) {
                            connection.release();
                            res.json({"code" : 100, "status" : "Error in connection database"});
                            return;
                            }
                            var countCompanyID=0;
                            var CompanyID;
                            var CompanyName;
                            var queryClause2 = "Select x.countt as countCompanyID,CompanyID as ci, CompanyName as cn, BillingAddress as ba, BillingCity as bc, BillingState as bs, BillingZip as bz, BillingContactFirstName as bcfn, BillingContactLastName as bcln,BillingContactEmail as bce, BillingContactPhone as bcp, CompanyStatusID as csid From Company,(select count(*) as countt FROM Company) as x Order by CompanyName ";
                            connection.query(queryClause2,function(err,rows,fields){
                                             
                                             connection.release();
                                             if(!err)
                                             {
                                             countCompanyID = rows[0].countCompanyID;
                                             CompanyID = new Array(countCompanyID);
                                             CompanyName = new Array(countCompanyID);
                                             for(var i =0; i <countCompanyID ; i++)
                                             {
                                             if (rows[i]!=null && rows[i].ci!= undefined)
                                             {
                                             
                                             
                                             dataForShowing1[i]=new Array(12);
                                             CompanyID[i]=rows[i].ci;
                                             CompanyName[i]=rows[i].cn;
                                             //console.log("CompanyName " + i +"  =  " + rows[i].cn)
                                            // console.log("CompanyID " + i +"  =  " + rows[i].ci)
                                             //console.log("");
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
                                             
                                             
                                             }
                                             
                                             }
                                            // console.log('CompanyCount = ' + countCompanyID);
                                             //;console.log(CompanyID);
                                             res.render('chooseExistingCompanyadmin', {h1:'Select Company',use:{username:'Administrator'},title:'The result of all Companys',CompanyCount:countCompanyID,CompanyID:CompanyID,CompanyName:CompanyName,dataForShowingE:dataForShowing1});
                                             }
                                             else{
                                             console.log('error in Select CompanyInfo!');
                                             
                                             res.render('errorPage', {usernameE: username,h1:'Error in Select Company Infomation',title:"Error in Select ComapnyInfo",errorMessage :'Error in Select CompanyInfo!'});
                                             return;
                                             }

                                             
                                             

                            
                            
                                             });
                            })
    }
    else if(choice ==2){
        console.log('aaaa');
        res.render('addNewCompanyAdmin', {title:title});
    }
    else
    {console.log("Error");}
}
/*
 poolH.getConnection(function(err,connection){
 if (err) {
 connection.release();
 response.json({"code" : 100, "status" : "Error in connection database"});
 return;
 }
 //queryDPFID='Select DPFID from DPFDOC WHERE DPFID like "%'+req.query.key+'%;"'
 queryDPFID='SELECT DPFID from DPFDOC where DPFID like "%'+request.query.key+'%"'
 connection.query(queryDPFID,function(err,rows){
 connection.release();
 if(!err)
 {
 var data=[];
 for(i=0;i<rows.length;i++)
 {
 data.push(rows[i].DPFID);
 
 }
 console.log(data);
 response.end(JSON.stringify(data));
 
 }
 else
 {
 console.log('error in select dpfid');
 response.render('errorPage',{title:'Select DPFID ', h1:'Select DPFID', errorMessage:'ERROR IN DPF!', usernameE:'adminBob'});//???why
 }
 })
 });
 

*/
