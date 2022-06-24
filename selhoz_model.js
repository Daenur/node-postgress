const Pool = require('pg').Pool
const pool = new Pool({
  "user": "nsi",
  "host": "45.89.26.151",
  "database": "nsi",
  "password": "endless",
  "port": 5432,
  "dialect": "postgres"
});
const poolgis=new Pool({
"user":"nsi",
"host":"45.89.26.151",
"database":"postgis_db",
"password":"endless",
"port":5432,
"dialect":"postgres"
});
const poolmy = new Pool({
  "user": "postgres",
  "host": "172.16.1.13",
  "database": "NSI_test",
  "password": "Qzwx234",
  "port": 5434,
  "dialect": "postgres"
});

 getSelhoz = (schema,table) => {
  return new Promise(function(resolve, reject) {
    const sql='SELECT * FROM "'+schema+'"."'+table+'"';
    console.log(sql);
    pool.query(sql,(error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}

getProjects = () => {
  return new Promise(function(resolve, reject) {
    const sql='SELECT  *\n' +
        'FROM "projects".project \n' +
        'INNER JOIN (SELECT STRING_AGG("crop".crop_classification.name || \'\',\',\') as Crops,\n' +
        'project_crop.id_project FROM "projects".project_crop\n' +
        'INNER JOIN "crop".crop_classification ON project_crop.id_crop="crop".crop_classification.id_crop_cl \n' +
        'GROUP BY project_crop.id_project) AS crop  USING (id_project) \n' +
        '\t\t\t\n' +
        '\t\t\tINNER JOIN (SELECT STRING_AGG(atd."info_area_devision".name_full || \'\',\',\') as Devisions, project_devision.id_project \n' +
        '\t\t\t\t\t\tFROM "projects".project_devision INNER JOIN atd."info_area_devision" ON project_devision.id_area=atd."info_area_devision".id_area\n' +
        '\t\t\t\t\t\tGROUP BY project_devision.id_project) AS div USING (id_project)\n' +
        '\t\t\t\t\t\t\n' +
        '\t\t\t\t\t\t\n' +
        'INNER JOIN (SELECT STRING_AGG(other.season.season_name || \'\',\',\') as Seasons, \n' +
        'project_season.id_project FROM "projects".project_season \n' +
        'INNER JOIN other.season ON project_season .id_season=other.season.id_season\t\t\n' +
        'GROUP BY project_season.id_project) AS season USING (id_project)';
    pool.query(sql,(error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}

getProject = (project) => {
   console.log(project)
  return new Promise(function(resolve, reject) {
    const sql='SELECT  *\n' +
        'FROM "projects".project \n' +
        'INNER JOIN (SELECT STRING_AGG("crop".crop_classification.name || \'&&\' || "crop".crop_classification.id_crop_cl,\',\') as Crops,\n' +
        'project_crop.id_project FROM "projects".project_crop\n' +
        'INNER JOIN "crop".crop_classification ON project_crop.id_crop="crop".crop_classification.id_crop_cl \n' +
        'GROUP BY project_crop.id_project) AS crop  USING (id_project) \n' +
        '\t\t\t\n' +
        '\t\t\tINNER JOIN (SELECT STRING_AGG(atd."info_area_devision".name_full || \'&&\' || atd."info_area_devision".id_area,\',\') as Devisions, project_devision.id_project \n' +
        '\t\t\t\t\t\tFROM "projects".project_devision INNER JOIN atd."info_area_devision" ON project_devision.id_area=atd."info_area_devision".id_area\n' +
        '\t\t\t\t\t\tGROUP BY project_devision.id_project) AS div USING (id_project)\n' +
        '\t\t\t\t\t\t\n' +
        '\t\t\t\t\t\t\n' +
        'INNER JOIN (SELECT STRING_AGG(other.season.season_name || \'&&\' || "other".season.id_season,\',\') as Seasons, \n' +
        'project_season.id_project FROM "projects".project_season \n' +
        'INNER JOIN other.season ON project_season .id_season=other.season.id_season\t\t\n' +
        'GROUP BY project_season.id_project) AS season USING (id_project) WHERE project.id_project='+"'"+project+"'";
    pool.query(sql,(error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}

getsubProject = (project) => {
  console.log(project+"  subs")
  return new Promise(function(resolve, reject) {
    const sql='SELECT id_subproject,id_project,name_subproject,date_start,date_plan_finish,date_finish,status,id_area,crop,season\n' +
        'FROM "projects".subproject\n' +
        'INNER JOIN (SELECT "crop".crop_classification.name as crop, "crop".crop_classification.id_crop_cl \n' +
        '\t\t\tFROM "crop".crop_classification) as ewe USING (id_crop_cl)\n' +
        '\n' +

        'INNER JOIN (SELECT other.season.season_name as season, other.season.id_season \n' +
        '\t\t\tFROM other.season) as ewe3 USING (id_season) WHERE subproject.id_project='+project;
    pool.query(sql,(error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}

getdist = (project) => {
  console.log(project+"  sist")
  return new Promise(function(resolve, reject) {
    const sql='SELECT id_area,country,devis,name_full,name_shot,code_devision,date_start,date_end,shape FROM atd.info_area_devision \n' +
        'inner join (SELECT *  FROM atd.link_up_down where id_parent_area='+project+') as total USING(id_area)\n' +
        'inner join (SELECT name_full as country,id_country FROM atd.country ) as total2 USING(id_country)\n' +
        'inner join (SELECT name_devis as devis,id_type_devis FROM atd.type_devision ) as total3 USING(id_type_devis)\n' +
        'inner join (SELECT name_status_shape as shape,id_status_shape FROM atd.status_shape ) as total4\n' +
        'USING(id_status_shape)';
    pool.query(sql,(error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}

getAllstate = (project) => {
  return new Promise(function(resolve, reject) {
    const sql='SELECT id_area,country,devis,name_full,name_shot,code_devision,date_start,date_end,shape  FROM atd.info_area_devision  \n' +
        'inner join (SELECT name_full as country,id_country FROM atd.country ) as total2 USING(id_country)\n' +
        'inner join (SELECT name_devis as devis,id_type_devis FROM atd.type_devision ) as total3 USING(id_type_devis)\n' +
        'inner join (SELECT name_status_shape as shape,id_status_shape FROM atd.status_shape ) as total4 \n' +
        'USING(id_status_shape) where id_type_devis=1';
    pool.query(sql,(error, results) => {
		console.log(error)
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}

getcountry = (schema,table) => {
  return new Promise(function(resolve, reject) {
    const sql='SELECT id_area,name_full FROM atd.info_area_devision where id_type_devis=1';
    console.log(sql);
    pool.query(sql,(error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}

getSelhozorder = (schema,table,order) => {
  return new Promise(function(resolve, reject) {
    const sql='SELECT * FROM "'+schema+'"."'+table+'" ORDER BY '+'"'+order+'"';
    console.log(sql);
    pool.query(sql,(error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}

getFKSelect = (schema,table,id) => {
  return new Promise(function(resolve, reject) {
    const sql='SELECT '+id+',name FROM "'+schema+'".'+table;
    console.log(sql);
    pool.query(sql,(error, results) => {
      if (error) {
        console.log(error);
        reject(error)
      }
      resolve(results.rows);
    })
  })
}

getFKSelhoz = (schema,table) => {
  return new Promise(function(resolve, reject) {
    const sql='SELECT kcu.column_name,ccu.table_name AS foreign_table_name,ccu.column_name AS foreign_column_name FROM information_schema.table_constraints AS tc JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name WHERE tc.constraint_schema = '+"'"+table+"'"+' AND tc.constraint_type = '+"'FOREIGN KEY'"+' AND tc.table_name = '+"'"+schema+"';";
    console.log(sql);
    pool.query(sql,(error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results);
    })
  })
}

getSelhozprops = (schema,table) => {
  return new Promise(function(resolve, reject) {
    //const sql='SELECT * FROM "public"."crop_Sort" \gdesc';
   // const sql='SELECT column_name,data_type FROM information_schema.columns WHERE table_name ="'+table+'" and table_schema ="'+schema+'"';
    console.log(sql);
    pool.query(sql,(error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results);
    })
  })
}

createSelhoz = (text,schema,table,id="0",tableid="0",schemaid="0") => {
  var sql="";
   if (tableid=="0")  sql=('INSERT INTO "'+schema+'"."'+table+'"  VALUES ('+text+')');
   else  sql=('INSERT INTO "'+schema+'"."'+table+'"  VALUES ('+text+')');
   console.log(sql)
  return new Promise(function(resolve, reject) {
    pool.query(sql, (error, results) => {
      if (error) {
        console.log(error);
        reject(error)
      }
      resolve(`A new selhoz has been added added: `)
    })
  })
}

createcustomSelhoz = (text,textcol,schema,table) => {
  var sql="";
  sql=('INSERT INTO "'+schema+'"."'+table+'" ('+textcol+') VALUES ('+text+')');
   console.log(sql)
  return new Promise(function(resolve, reject) {
    pool.query(sql, (error, results) => {
      if (error) {
        console.log(error);
        reject(error)
      }
      resolve(`A new has been added added: `)
    })
  })
}

const deleteSelhoz = (idname,id,schema,table) => {
id=id.replace('"',"'");
  id=id.replace('"',"'");
  console.log('DELETE FROM "'+schema+'"."'+table+'"  WHERE '+idname+' = '+id);
  return new Promise(function(resolve, reject) {
    pool.query('DELETE FROM "'+schema+'"."'+table+'"  WHERE '+idname+' = '+id, (error, results) => {
      if (error) {
        reject(error)
        console.log(error);
      }
      resolve('Merchant deleted with ID: '+id)
    })
  })
}

const deletecrop = (id,id_crop) => {
  return new Promise(function(resolve, reject) {
    pool.query('DELETE FROM projects.project_crop  WHERE id_project = '+id+' AND id_crop='+id_crop, (error, results) => {
      if (error) {
        reject(error)
        console.log(error);
      }
      resolve('Merchant deleted with ID: '+id)
    })
  })
}

const deleteseason = (idname,id,schema,table) => {
return new Promise(function(resolve, reject) {
    pool.query('DELETE FROM projects.project_season  WHERE id_project = '+id+' AND id_season='+id_crop, (error, results) => {
      if (error) {
        reject(error)
        console.log(error);
      }
      resolve('Merchant deleted with ID: '+id)
    })
  })
}

const deletearea = (idname,id,schema,table) => {
return new Promise(function(resolve, reject) {
    pool.query('DELETE FROM projects.project_devision  WHERE id_project = '+id+' AND id_area='+id_crop, (error, results) => {
      if (error) {
        reject(error)
        console.log(error);
      }
      resolve('Merchant deleted with ID: '+id)
    })
  })
}

const updateSelhoz = (idname,id,col,text,schema,table) => {
 let sql;
if (col.split(',').length>1) sql=('UPDATE "'+schema+'"."'+table+'" SET ('+col+')=('+text+') WHERE '+idname+' = '+id);
else sql=('UPDATE "'+schema+'"."'+table+'" SET '+col+'='+text+' WHERE '+idname+' = '+id);
console.log(sql);
  return new Promise(function(resolve, reject) {
    pool.query(sql, (error, results) => {
      if (error) {
        reject(error)
      }
      resolve("OK");
    })
  })
}

const getall = () => {
  return new Promise(function(resolve, reject) {
    pool.query("SELECT nspname FROM pg_catalog.pg_namespace", (error, results)=> {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}

const getRubric = (schema) => {
   console.log("SELECT table_name FROM information_schema.tables WHERE table_schema='"+schema+"'");
  return new Promise(function(resolve, reject) {
    pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='"+schema+"'", (error, results) => {
      if (error) {
        reject(error)
      }
       resolve(results.rows);
      });
    })
}

const getAllChild = (id_p) => {
   console.log("SELECT id_area FROM atd.link_up_down where id_parent_area="+id_p);
  return new Promise(function(resolve, reject) {
    pool.query("SELECT id_area,name_full FROM atd.info_area_devision inner join (SELECT *  FROM atd.link_up_down where id_parent_area="+id_p+") as total USING(id_area)", (error, results) => {
      if (error) {
        reject(error)
      }
       resolve(results.rows);
      });
    })
}

const getlogtype = (logtype) => {
  return new Promise(function(resolve, reject) {
    pool.query("SELECT * FROM log.log_file where type_log='"+logtype+"'", (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    });
  })
}

const getlogtable = (logtable) => {
  return new Promise(function(resolve, reject) {
    pool.query("SELECT * FROM log.log_file where shematable='"+logtable+"'", (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    });
  })
}

const getlog = () => {
  return new Promise(function(resolve, reject) {
    pool.query("SELECT * FROM log.log_file", (error, results)=> {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}

getFKSeason = () => {
  return new Promise(function(resolve, reject) {
    const sql='SELECT id_season,season_name FROM other.season';
    console.log(sql);
    pool.query(sql,(error, results) => {
      if (error) {
        console.log(error);
        reject(error)
      }
      resolve(results.rows);
    })
  })
}

getFKArea = () => {
  return new Promise(function(resolve, reject) {
    const sql='SELECT id_area,name_full FROM atd.info_area_devision';
    console.log(sql);
    pool.query(sql,(error, results) => {
      if (error) {
        console.log(error);
        reject(error)
      }
      resolve(results.rows);
    })
  })
}

generateSub = (text) => {
  var sql="";
  sql=('INSERT INTO projects.subproject (id_project,name_subproject,date_start,date_plan_finish,date_finish,status,id_crop_cl,id_area,id_season) VALUES ('+text+')');
   console.log(sql)
  return new Promise(function(resolve, reject) {
    pool.query(sql, (error, results) => {
      if (error) {
        console.log(error);
        reject(error)
      }
      resolve(`A new has been added added: `)
    })
  })
}

insertcrop = (project,id) => {
  return new Promise(function(resolve, reject) {
    const sql='INSERT INTO projects.project_crop  VALUES (default,(SELECT id_project FROM projects.project where id_project='+project+' ),'+id+')';
    console.log(sql);
    pool.query(sql,(error, results) => {
      if (error) {
        console.log(error);
        reject(error)
      }
      resolve(results.rows);
    })
  })
}

insertseason = (project,id) => {
  return new Promise(function(resolve, reject) {
    const sql='INSERT INTO projects.project_season  VALUES (default,'+id+',(SELECT id_project FROM projects.project where id_project='+project+' ))';
    console.log(sql);
    pool.query(sql,(error, results) => {
      if (error) {
        console.log(error);
        reject(error)
      }
      resolve(results.rows);
    })
  })
}

insertarea = (project,id) => {
  return new Promise(function(resolve, reject) {
    const sql='INSERT INTO projects.project_devision  VALUES (default,(SELECT id_project FROM projects.project where id_project='+project+' ),1,'+id+')';
    console.log(sql);
    pool.query(sql,(error, results) => {
      if (error) {
        console.log(error);
        reject(error)
      }
      resolve(results.rows);
    })
  })
}

filter = (col,value,schema,table) => {
  return new Promise(function(resolve, reject) {
   let arrcol=col.split(',');
   let valcol=value.split(',');
   let filter=' WHERE '+arrcol[0]+'='+valcol[0];
   for (let i=1;i<arrcol.length;i++) 
   {
	   filter+=' AND '+arrcol[i]+'='+valcol[i];
   }
   console.log(arrcol.length);
     const sql='SELECT * FROM '+schema+'.'+table+filter;
	 console.log(sql);
	  pool.query(sql,(error, results) => {
      if (error) {
        console.log(error);
        reject(error)
      }
      resolve(results.rows);
    })
  })
}

getGeo=(ref)=>{
return new Promise(function(resolve,reject) {
let sql;
sql="SELECT info_area_devision.name_full,type_devision.name_devis, ST_AsText(polygon_full) as rgeom FROM atd.shape,atd.info_area_devision,atd.type_devision where shape.id_area=info_area_devision.id_area AND type_devision.id_type_devis=info_area_devision.id_type_devis AND info_area_devision.code_devision="
let buf='';
		if (ref["ids"]) { buf="'"+ref["ids"]+"'"+" AND info_area_devision.id_type_devis=1";}
		if (ref["idd"]) { buf="'"+ref["idd"]+"'"+" AND info_area_devision.id_type_devis=2";}
pool.query(sql+buf,(error, results) => {
if (error) {
reject(error)
}
console.log(sql);
let buf=new Object(results.rows[0]);
let sum=new Object();
	sum["type"]=buf["name_devis"];
	sum["name"]=buf["name_full"];
	
	sum["polygon"]=buf["rgeom"].replace('MULTIPOLYGON','');
	sum["polygon"]=sum["polygon"].replace(/\(|\)/g, '')
	sum["polygon"]=sum["polygon"].replace(/,/g,';');
	sum["polygon"]=sum["polygon"].replace(/ /g,',');
	let sum2=sum["polygon"].split(";");
	let sum3='';

for (let i=0;i<sum2.length;i++)
{
	let co=sum2[i].split(",");
	sum3=sum3+'{"lat":"'+co[1]+'","lon":"'+co[0]+'"},'
}
sum3=sum3.substr(0,sum3.length-1);
sum3="["+sum3+"]";
sum3=JSON.parse(sum3);
sum["polygon"]=sum3;
	
      resolve(sum);
})
})
}


getGeolite=(ref)=>{
return new Promise(function(resolve,reject) {
let sql;
sql="SELECT info_area_devision.name_full,type_devision.name_devis, ST_AsText(polygon_full) as rgeom,ST_NPoints(polygon_full) as num FROM atd.shape,atd.info_area_devision,atd.type_devision where shape.id_area=info_area_devision.id_area AND type_devision.id_type_devis=info_area_devision.id_type_devis AND info_area_devision.code_devision="
let buf='';
let maxpoint=''
		if (ref["ids"]) { buf="'"+ref["ids"]+"'"+" AND info_area_devision.id_type_devis=1";}
		if (ref["idd"]) { buf="'"+ref["idd"]+"'"+" AND info_area_devision.id_type_devis=2";}
		if (ref["maxpoint"]) { maxpoint=Number(ref["maxpoint"])}
pool.query(sql+buf,(error, results) => {
if (error) {
reject(error)
}
let buf=new Object(results.rows[0]);
let sum=new Object();
	sum["type"]=buf["name_devis"];
	sum["name"]=buf["name_full"];
	
	sum["polygon"]=buf["rgeom"].replace('MULTIPOLYGON','');
	sum["polygon"]=sum["polygon"].replace(/\(|\)/g, '')
	sum["polygon"]=sum["polygon"].replace(/,/g,';');
	sum["polygon"]=sum["polygon"].replace(/ /g,',');
	let sum2=sum["polygon"].split(";");
	let sum3='';
if (maxpoint<300) maxpoint=300;
if (maxpoint>Number(buf["num"])) maxpoint=Number(buf["num"]);
let step=Math.floor(Number(buf["num"])/maxpoint);
console.log(step);
for (let i=0;i<sum2.length;i=i+step)
{
	let co=sum2[i].split(",");
	sum3=sum3+'{"lat":"'+co[1]+'","lon":"'+co[0]+'"},'
}
sum3=sum3.substr(0,sum3.length-1);
sum3="["+sum3+"]";
sum3=JSON.parse(sum3);
sum["polygon"]=sum3;
	
      resolve(sum);
})
})
}

getGeojson=(ref)=>{
return new Promise(function(resolve,reject) {
let sql;
sql="SELECT info_area_devision.name_full,type_devision.name_devis, ST_asGeoJSON(polygon_full) as rgeom FROM atd.shape,atd.info_area_devision,atd.type_devision where shape.id_area=info_area_devision.id_area AND type_devision.id_type_devis=info_area_devision.id_type_devis AND info_area_devision.code_devision="
let buf='';
		if (ref["ids"]) { buf="'"+ref["ids"]+"'"+" AND info_area_devision.id_type_devis=1";}
		if (ref["idd"]) { buf="'"+ref["idd"]+"'"+" AND info_area_devision.id_type_devis=2";}
pool.query(sql+buf,(error, results) => {
if (error) {
reject(error)
}
console.log(sql);
let buf=new Object(results.rows[0]);
let sum=new Object();
	sum["type"]='FeatureCollection';
	sum["features"]=JSON.parse(buf["rgeom"]);
	console.log(sum["features"]["coordinates"][0]);

	
      resolve(sum);
})
})
}


getCentroid=(ref)=>{
return new Promise(function(resolve,reject) {
let sql;
sql="SELECT info_area_devision.name_full,type_devision.name_devis, ST_AsText(ST_Centroid(polygon_full)) as rgeom FROM atd.shape,atd.info_area_devision,atd.type_devision where shape.id_area=info_area_devision.id_area AND type_devision.id_type_devis=info_area_devision.id_type_devis AND info_area_devision.code_devision="
let buf='';
		if (ref["ids"]) { buf="'"+ref["ids"]+"'"+" AND info_area_devision.id_type_devis=1";}
		if (ref["idd"]) { buf="'"+ref["idd"]+"'"+" AND info_area_devision.id_type_devis=2";}
pool.query(sql+buf,(error, results) => {
if (error) {
reject(error)
}
console.log(sql);
let buf=new Object(results.rows[0]);
let sum=new Object();
	sum["type"]=buf["name_devis"];
	sum["name"]=buf["name_full"];
		buf["rgeom"]=buf["rgeom"].replace('POINT','');
	buf["rgeom"]=buf["rgeom"].slice(1,-1);
	

	buf["rgeom"]='{"lat":"'+buf["rgeom"].split(" ")[1]+'","lon":"'+buf["rgeom"].split(" ")[0]+'"}';
	buf["rgeom"]=JSON.parse(buf["rgeom"]);
	sum["point"]=buf["rgeom"];
      resolve(sum);
})
})
}

getAllstatebyMarkin = (ref) => {
  return new Promise(function(resolve, reject) {
let sql;
  sql='SELECT code_devision as "stateCode",name_full as "state" FROM atd.info_area_devision where id_type_devis=1 ';
  if (ref["ids"])  {sql='SELECT code_devision as "stateCode",name_full as "state" FROM atd.info_area_devision where id_type_devis=1 AND code_devision='+"'"+ref["ids"]+"'";} 
else {
 if (ref["name"])   {sql='SELECT code_devision as "stateCode",name_full as "state" FROM atd.info_area_devision where id_type_devis=1 AND name_full='+"'"+ref["name"]+"'";} 
else {sql='SELECT code_devision as "stateCode",name_full as "state" FROM atd.info_area_devision where id_type_devis=1 ';}}

    pool.query(sql,(error, results) => {
      if (error) {
        reject(error)
      }
	let sum=new Object();
	sum["states"]=results.rows;
      resolve(sum);
    })
  })
}

getAlldistrbyMarkin = (ref) => {
  return new Promise(function(resolve, reject) {
    let sql;
  sql='SELECT a1.code_devision as "stateCode",a1.name_full as state,info_area_devision.code_devision as "districtCode",info_area_devision.name_full as "district",info_area_devision.name_shot as "districtAltNames",shape.mrd_code as "mrdcode" FROM atd.info_area_devision,atd.shape,atd.link_up_down LEFT JOIN atd.info_area_devision as a1 ON (a1.id_area = link_up_down.id_parent_area) where info_area_devision.id_type_devis=2 AND info_area_devision.id_area=shape.id_area AND info_area_devision.id_area=link_up_down.id_area ORDER BY a1.name_full,info_area_devision.name_full ASC';
  if (ref["sname"]) { sql='SELECT a1.code_devision as "stateCode",a1.name_full as state,info_area_devision.code_devision as "districtCode",info_area_devision.name_full as "district",info_area_devision.name_shot as "districtAltNames",shape.mrd_code as "mrdcode" FROM atd.info_area_devision,atd.shape,atd.link_up_down LEFT JOIN atd.info_area_devision as a1 ON (a1.id_area = link_up_down.id_parent_area) where info_area_devision.id_type_devis=2 AND info_area_devision.id_area=shape.id_area AND info_area_devision.id_area=link_up_down.id_area AND a1.name_full='+"'"+ref["sname"]+"'"+' ORDER BY a1.name_full,info_area_devision.name_full ASC'; } else {
	if (ref["ids"]) { sql='SELECT a1.code_devision as "stateCode",a1.name_full as state,info_area_devision.code_devision as "districtCode",info_area_devision.name_full as "district",info_area_devision.name_shot as "districtAltNames",shape.mrd_code as "mrdcode" FROM atd.info_area_devision,atd.shape,atd.link_up_down LEFT JOIN atd.info_area_devision as a1 ON (a1.id_area = link_up_down.id_parent_area) where info_area_devision.id_type_devis=2 AND info_area_devision.id_area=shape.id_area AND info_area_devision.id_area=link_up_down.id_area AND a1.code_devision='+"'"+ref["ids"]+"'"+'  ORDER BY a1.name_full,info_area_devision.name_full ASC'; } else {
		if (ref["idd"]) { sql='SELECT a1.code_devision as "stateCode",a1.name_full as state,info_area_devision.code_devision as "districtCode",info_area_devision.name_full as "district",info_area_devision.name_shot as "districtAltNames",shape.mrd_code as "mrdcode" FROM atd.info_area_devision,atd.shape,atd.link_up_down LEFT JOIN atd.info_area_devision as a1 ON (a1.id_area = link_up_down.id_parent_area) where info_area_devision.id_type_devis=2 AND info_area_devision.id_area=shape.id_area AND info_area_devision.id_area=link_up_down.id_area AND info_area_devision.code_devision='+"'"+ref["idd"]+"'"+'  ORDER BY a1.name_full,info_area_devision.name_full ASC'; } else {
					if (ref["mrd"]) { sql='SELECT a1.code_devision as "stateCode",a1.name_full as state,info_area_devision.code_devision as "districtCode",info_area_devision.name_full as "district",info_area_devision.name_shot as "districtAltNames",shape.mrd_code as "mrdcode" FROM atd.info_area_devision,atd.shape,atd.link_up_down LEFT JOIN atd.info_area_devision as a1 ON (a1.id_area = link_up_down.id_parent_area) where info_area_devision.id_type_devis=2 AND info_area_devision.id_area=shape.id_area AND info_area_devision.id_area=link_up_down.id_area AND shape.mrd_code='+"'"+ref["mrd"]+"'"+'  ORDER BY a1.name_full,info_area_devision.name_full ASC'; } else {
								if (ref["name"]) { sql='SELECT a1.code_devision as "stateCode",a1.name_full as state,info_area_devision.code_devision as "districtCode",info_area_devision.name_full as "district",info_area_devision.name_shot as "districtAltNames",shape.mrd_code as "mrdcode" FROM atd.info_area_devision,atd.shape,atd.link_up_down LEFT JOIN atd.info_area_devision as a1 ON (a1.id_area = link_up_down.id_parent_area) where info_area_devision.id_type_devis=2 AND info_area_devision.id_area=shape.id_area AND info_area_devision.id_area=link_up_down.id_area AND info_area_devision.name_full='+"'"+ref["name"]+"'"+' ORDER BY a1.name_full,info_area_devision.name_full ASC'; } else {
											sql='SELECT a1.code_devision as "stateCode",a1.name_full as state,info_area_devision.code_devision as "districtCode",info_area_devision.name_full as "district",info_area_devision.name_shot as "districtAltNames",shape.mrd_code as "mrdcode" FROM atd.info_area_devision,atd.shape,atd.link_up_down LEFT JOIN atd.info_area_devision as a1 ON (a1.id_area = link_up_down.id_parent_area) where info_area_devision.id_type_devis=2 AND info_area_devision.id_area=shape.id_area AND info_area_devision.id_area=link_up_down.id_area ORDER BY a1.name_full,info_area_devision.name_full ASC';
											}
								}
					} 
				}
			}
    console.log(sql);
    pool.query(sql,(error, results) => {
      if (error) {
        reject(error)
      }
      let sum=new Object();
	sum["districts"]=results.rows;
      resolve(sum);

    })
  })
}


getTargetpoint = (ref) => {
  return new Promise(function(resolve, reject) {
let sql,lat,lon;
  sql='';
  if (ref["lat"])  {lat=ref["lat"]} 

 if (ref["lon"])   {lon=ref["lon"]} 
sql="SELECT country.name_full,info_area_devision.id_country,type_devision.name_devis,info_area_devision.name_full,info_area_devision.code_devision,st_contains(shape.polygon_full, ST_GeomFromText('POINT("+lon+" "+lat+")', 4326)) FROM atd.shape,atd.info_area_devision,atd.type_devision,atd.country where st_contains(shape.polygon_full, ST_GeomFromText('POINT("+lon+" "+lat+")', 4326)) AND shape.id_area=info_area_devision.id_area AND type_devision.id_type_devis=info_area_devision.id_type_devis AND info_area_devision.id_country=country.id_country"

    pool.query(sql,(error, results) => {
      if (error) {
        reject(error)
      }
	  let sum=new Object();
	  sum["country"]='';
	  sum["countryCode"]='';
	  sum["state"]='';
	  sum["stateCode"]='';
	  sum["district"]='';
	  sum["districtCode"]='';
	  sum["tehsilCode"]='';
	  sum["tehsil"]='';
	  sum["blockCode"]='';
	  sum["block"]='';
	  sum["gpCode"]='';
	  sum["gp"]='';
	  sum["villageCode"]='';
	  sum["village"]='';
	  for (let i=0;i<results.rows.length;i++)
	  {
		  let buf=new Object(results.rows[i]);
	  if (buf["name_devis"]=='District') {
		   sum["district"]=buf["name_full"];
	  sum["districtCode"]=buf["code_devision"];
	  }
	  	  if (buf["name_devis"]=='State') {
		   sum["state"]=buf["name_full"];
	  sum["stateCode"]=buf["code_devision"];
	  	   sum["country"]='India';
	  sum["countryCode"]=buf["id_country"];
	  }
	  console.log(sum);
	  }
	
	
      resolve(sum);
    })
  })
}

getProjectbyMarkin = (ref) => {
  return new Promise(function(resolve, reject) {
    const sql="SELECT * FROM projects.project INNER JOIN (SELECT STRING_AGG(crop.crop_classification.name ,',') as Crops, project_crop.id_project FROM projects.project_crop INNER JOIN crop.crop_classification ON project_crop.id_crop=crop.crop_classification.id_crop_cl GROUP BY project_crop.id_project) AS crop USING (id_project) INNER JOIN (SELECT STRING_AGG(atd.info_area_devision.name_full,',') as Devisions, project_devision.id_project FROM projects.project_devision INNER JOIN atd.info_area_devision ON project_devision.id_area=atd.info_area_devision.id_area GROUP BY project_devision.id_project) AS div USING (id_project) INNER JOIN (SELECT STRING_AGG(other.season.season_name,',') as Seasons, project_season.id_project FROM projects.project_season INNER JOIN other.season ON project_season .id_season=other.season.id_season GROUP BY project_season.id_project) AS season USING (id_project)";
	let buf='';
		if (ref["idp"]) { buf=' WHERE  project.id_project='+"'"+ref["idp"]+"'";}
		if (ref["namep"]) {buf=' WHERE  project.name_project='+"'"+ref["namep"]+"'";}
    pool.query(sql+buf,(error, results) => {
      if (error) {
        reject(error)
      }
	  let sum=new Object();
      	sum["projects"]=results.rows;
      resolve(sum);
    })
  })
}


getSubprojectbyMarkin = (ref) => {
  return new Promise(function(resolve, reject) {
    const sql="SELECT id_subproject,id_project,name_subproject,date_start,date_plan_finish,date_finish,status,crop,season,area FROM projects.subproject INNER JOIN (SELECT crop.crop_classification.name as crop, crop.crop_classification.id_crop_cl FROM crop.crop_classification) as ewe USING (id_crop_cl) INNER JOIN (SELECT other.season.season_name as season, other.season.id_season FROM other.season) as ewe3 USING (id_season) INNER JOIN (SELECT atd.info_area_devision.name_full as area, atd.info_area_devision.id_area FROM atd.info_area_devision ) AS div USING (id_area)"
	let buf='';
		if (ref["idp"]) { buf=' WHERE  subproject.id_project='+"'"+ref["idp"]+"'";}
		if (ref["idsp"]) { buf=' WHERE  subproject.id_subproject='+"'"+ref["idsp"]+"'";}
		if (ref["namesp"]) {buf=' WHERE  subproject.name_subproject='+"'"+ref["namesp"]+"'";}
    pool.query(sql+buf,(error, results) => {
      if (error) {
        reject(error)
      }
	  let sum=new Object();
      	sum["subprojects"]=results.rows;
      resolve(sum);
    })
  })
}


getchildShape=(ref)=>{
return new Promise(function(resolve,reject) {
let sql;

let buf='';
		if (ref["ids"]) { sql='SELECT info_area_devision.id_area,info_area_devision.name_full,ST_AsText(shape.polygon_full) as geom FROM atd.info_area_devision,atd.shape inner join (SELECT * FROM atd.link_up_down where id_parent_area='+ref["ids"]+') as total USING(id_area) where shape.id_area=info_area_devision.id_area'}
		if (ref["names"]) { sql='';}
pool.query(sql+buf,(error, results) => {
if (error) {
reject(error)
}
 let sum=new Object();
	sum["childshapes"]=results.rows;
      resolve(sum);
})
})
}

module.exports = {
  getSelhoz,
  getFKSelhoz,
  getFKSelect,
  updateSelhoz,
  deleteSelhoz,
  getRubric,
  getall,
  getSelhozprops,
  createSelhoz,
  getSelhozorder,
  getProjects,
  getProject,
  getsubProject,
  getdist,
  getcountry,
  getlog,
  getlogtable,
  getlogtype,
  getFKArea,
  getFKSeason,
  insertcrop,
  insertarea,
  insertseason,
  getAllChild,
  getAllstate,
  createcustomSelhoz,
  deletecrop,
  deletearea,
  deleteseason,
  generateSub,
  filter,
getAlldistrbyMarkin,
getAllstatebyMarkin,
getGeo,
getGeolite,
getTargetpoint,
getProjectbyMarkin,
getSubprojectbyMarkin,
getGeojson,
getCentroid,
getchildShape,
}

