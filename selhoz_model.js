const Pool = require('pg').Pool
const pool = new Pool({
  "user": "postgres",
  "host": "192.168.10.230",
  "database": "NSI_test",
  "password": "postgres",
  "port": 5434,
  "dialect": "postgres"
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
        'GROUP BY project_season.id_project) AS season USING (id_project) WHERE project.name_project='+"'"+project+"'";
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



const updateSelhoz = (idname,id,col,text,schema,table) => {
  console.log('UPDATE "'+schema+'"."'+table+'" SET ('+col+')=('+text+') WHERE '+idname+' = '+id);
  return new Promise(function(resolve, reject) {
    pool.query('UPDATE "'+schema+'"."'+table+'" SET ('+col+')=('+text+') WHERE '+idname+' = '+id, (error, results) => {
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


insertcrop = (project,id) => {
  return new Promise(function(resolve, reject) {
    const sql='INSERT INTO projects.project_crop  VALUES (default,(SELECT id_project FROM projects.project where name_project='+project+' ),'+id+')';
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
    const sql='INSERT INTO projects.project_season  VALUES (default,'+id+',(SELECT id_project FROM projects.project where name_project='+project+' ))';
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
    const sql='INSERT INTO projects.project_devision  VALUES (default,(SELECT id_project FROM projects.project where name_project='+project+' ),'+id+')';
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
  createcustomSelhoz
}