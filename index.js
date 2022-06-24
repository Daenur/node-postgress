
const readXlsxFile = require('read-excel-file/node')
const express = require('express')
const app = express()
const port = 3001

const selhoz_model = require('./selhoz_model')

app.use(express.json())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.get('/api',function(req,res) {
  res.sendFile(__dirname + '\\index.html');
});

app.get('/', (req, res) => {
    selhoz_model.getall()
        .then(response => {


            res.send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })


})

app.get('/filter/:col.:value.:schema.:table', (req, res) => {
    
    selhoz_model.filter(req.params.col.substr(1),req.params.value.substr(1),req.params.schema.substr(1),req.params.table.substr(1))
        .then(response => {
            console.log(response);
            res.send(response);
        })
        .catch(error => {
            console.log(error);
            res.status(500).send(error);
        })
})

app.get('/schema/:schemaid', (req, res) => {
    console.log(req.params.schemaid.substr(1));
    selhoz_model.getRubric(req.params.schemaid.substr(1))
        .then(response => {
            console.log(response);
            res.send(response);
        })
        .catch(error => {
            console.log(error);
            res.status(500).send(error);
        })
})



app.get('/table/:tableid.:schemaid', (req, res) => {
    console.log('3');
    console.log(req.params);
    selhoz_model.getSelhoz(req.params.schemaid.substr(1),req.params.tableid.substr(1))
        .then(response => {


            res.send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })


})

app.get('/projects/', (req, res) => {
    console.log('projects');
    console.log(req.params);
    selhoz_model.getProjects()
        .then(response => {


            res.send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.get('/project/:projectid', (req, res) => {
    selhoz_model.getProject(req.params.projectid.substr(1))
        .then(response => {
            console.log(response);
            res.send(response);
        })
        .catch(error => {
            console.log(error);
            res.status(500).send(error);
        })
})

app.get('/subproject/:projectid', (req, res) => {
    selhoz_model.getsubProject(req.params.projectid.substr(1))
        .then(response => {
            console.log(response);
            res.send(response);
        })
        .catch(error => {
            console.log(error);
            res.status(500).send(error);
        })
})

app.post('/generatesub/:id.:dates.:datee.:datef.:crop.:atd.:sea', (req, res) => {
	
	console.log(req.params)
	let count=0;
	let cropA=req.params.crop.substr(1).split('&');
	let atdA=req.params.atd.substr(1).split('&');
	let seaA=req.params.sea.substr(1).split('&');
	for (let i=0;i<cropA.length-1;i++)
	{
		for (let j=0;j<atdA.length-1;j++) {
			for (let k=0;k<seaA.length-1;k++)
			{count++;
	let sql=req.params.id.substr(1)+",'Subproject "+req.params.id.substr(1)+"_"+count+"',"+req.params.dates.substr(1)+','+req.params.datee.substr(1)+','+req.params.datef.substr(1)+',1,'+cropA[i]+','+atdA[j]+','+seaA[k];
	console.log(sql)
    selhoz_model.generateSub(sql);
	}}}
})

app.get('/dist/:projectid', (req, res) => {
    selhoz_model.getdist(req.params.projectid.substr(1))
        .then(response => {
            console.log(response);
            res.send(response);
        })
        .catch(error => {
            console.log(error);
            res.status(500).send(error);
        })
})

app.get('/country/', (req, res) => {
    selhoz_model.getcountry()
        .then(response => {
            console.log(response);
            res.send(response);
        })
        .catch(error => {
            console.log(error);
            res.status(500).send(error);
        })
})

app.get('/state/', (req, res) => {
    selhoz_model.getAllstate()
        .then(response => {
            console.log(response);
            res.send(response);
        })
        .catch(error => {
            console.log(error);
            res.status(500).send(error);
        })
})


app.get('/atdchild/:id', (req, res) => {
    selhoz_model.getAllChild(req.params.id.substr(1))
        .then(response => {
            console.log(response);
            res.send(response);
        })
        .catch(error => {
            console.log(error);
            res.status(500).send(error);
        })
})

app.get('/tableorder/:tableid.:schemaid.:order', (req, res) => {
    console.log('3');
    console.log(req.params);
    selhoz_model.getSelhozorder(req.params.schemaid.substr(1),req.params.tableid.substr(1),req.params.order.substr(1))
        .then(response => {


            res.send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })


})

app.get('/FK/:tableid.:schemaid', (req, res) => {
    console.log('FK');
    console.log(req.params);
    selhoz_model.getFKSelhoz(req.params.schemaid.substr(1),req.params.tableid.substr(1))
        .then(response => {


            res.send(response.rows);
        })
        .catch(error => {
            res.status(500).send(error);
        })


})

app.get('/load/', (req, res) => {
    console.log(5);
    readXlsxFile('Example1.xlsx').then((rows) => {
        res.send(rows);
        console.log(rows);
    })


})

app.get('/FK/:tableid.:schemaid', (req, res) => {
    console.log('FK');
    console.log(req.params);
    selhoz_model.getFKSelhoz(req.params.schemaid.substr(1),req.params.tableid.substr(1))
        .then(response => {


            res.send(response.rows);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.get('/FKselect/:schemaid.:tableid.:id', (req, res) => {
    console.log('FKse');
    console.log(req.params);
    selhoz_model.getFKSelect(req.params.schemaid.substr(1),req.params.tableid.substr(1),req.params.id.substr(1))
        .then(response => {
            console.log(response);

            res.send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })


})



app.get('/props/:tableid.:schemaid', (req, res) => {
    console.log('5');
    console.log(req.params);
    selhoz_model.getSelhozprops(req.params.schemaid.substr(1),req.params.tableid.substr(1))
        .then(response => {


            res.send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })


})



app.post('/insert/:text.:tableid.:schemaid', (req, res) => {
    var utc = (new Date()).toString().split(' ').splice(1,4).join(' ')
    selhoz_model.createSelhoz("'"+utc+"','"+req.params.schemaid.substr(1)+"."+req.params.tableid.substr(1)+"','INSERT','"+req.params.text.substr(1).replace(/'/g,'').replace(/,/g,";")+"','none'",'log','log_file');
 console.log('444');    
console.log(req.params);
    selhoz_model.createSelhoz(req.params.text.substr(1),req.params.schemaid.substr(1),req.params.tableid.substr(1))
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.post('/insertcus/:text.:textcol.:tableid.:schemaid', (req, res) => {
    var utc = (new Date()).toString().split(' ').splice(1,4).join(' ')
    selhoz_model.createSelhoz("'"+utc+"','"+req.params.schemaid.substr(1)+"."+req.params.tableid.substr(1)+"','INSERT','"+req.params.text.substr(1).replace(/'/g,'').replace(/,/g,";")+"','none'",'log','log_file');
 console.log('444');    
console.log(req.params);
    selhoz_model.createcustomSelhoz(req.params.text.substr(1),req.params.textcol.substr(1),req.params.schemaid.substr(1),req.params.tableid.substr(1))
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.delete('/delete/:id.:idname.:tableid.:schemaid', (req, res) => {
    var utc = (new Date()).toString().split(' ').splice(1,4).join(' ')
    selhoz_model.createSelhoz("'"+utc+"','"+req.params.schemaid.substr(1)+"."+req.params.tableid.substr(1)+"','DELETE','none','oldid"+req.params.idname.substr(1)+"'",'log','log_file','id','tableid','schemaid');
    selhoz_model.deleteSelhoz(req.params.id.substr(1),req.params.idname.substr(1),req.params.schemaid.substr(1),req.params.tableid.substr(1))
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.get('/update/:idname.:id.:col.:text.:tableid.:schemaid', (req, res) => {
    var utc = (new Date()).toString().split(' ').splice(1,4).join(' ')
    selhoz_model.createSelhoz("'"+utc+"','"+req.params.schemaid.substr(1)+"."+req.params.tableid.substr(1)+"','UPDATE','"+req.params.text.substr(1).replace(/'/g,'')+"','oldvalue'",'log','log_file');
    selhoz_model.updateSelhoz(req.params.idname.substr(1),req.params.id.substr(1),req.params.col.substr(1),req.params.text.substr(1),req.params.schemaid.substr(1),req.params.tableid.substr(1))
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            console.log(error);
            res.status(500).send(error);
        })
})


app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})

app.get('/log/', (req, res) => {
    selhoz_model.getlog()
        .then(response => {
            console.log(response);
            res.send(response);
        })
        .catch(error => {
            console.log(error);
            res.status(500).send(error);
        })
})

app.get('/logtype/:logtype', (req, res) => {
    selhoz_model.getlogtype(req.params.logtype.substr(1))
        .then(response => {
            console.log(response);
            res.send(response);
        })
        .catch(error => {
            console.log(error);
            res.status(500).send(error);
        })
})

app.get('/logtable/:logtable', (req, res) => {
    selhoz_model.getlogtable(req.params.logtable.substr(1))
        .then(response => {
            console.log(response);
            res.send(response);
        })
        .catch(error => {
            console.log(error);
            res.status(500).send(error);
        })
})

app.get('/FKseason/', (req, res) => {
    selhoz_model.getFKSeason()
        .then(response => {
            console.log(response);
            res.send(response);
        })
        .catch(error => {
            console.log(error);
            res.status(500).send(error);
        })
})

app.get('/FKarea/', (req, res) => {
    selhoz_model.getFKArea()
        .then(response => {
            console.log(response);
            res.send(response);
        })
        .catch(error => {
            console.log(error);
            res.status(500).send(error);
        })
})

app.post('/insertcrop/:project.:id', (req, res) => {
console.log("insertcrop")
    selhoz_model.insertcrop(req.params.project.substr(1),req.params.id.substr(1))
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.post('/deletecrop/:project.:id', (req, res) => {
console.log("insertcrop")
    selhoz_model.deletecrop(req.params.project.substr(1),req.params.id.substr(1))
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.post('/insertseason/:project.:id', (req, res) => {
    console.log("insertseason")
    selhoz_model.insertseason(req.params.project.substr(1),req.params.id.substr(1))
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.post('/deletearea/:project.:id', (req, res) => {
console.log("insertcrop")
    selhoz_model.deletearea(req.params.project.substr(1),req.params.id.substr(1))
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.post('/insertarea/:project.:id', (req, res) => {
    console.log("insertarea")
    selhoz_model.insertarea(req.params.project.substr(1),req.params.id.substr(1))
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.post('/deleteseason/:project.:id', (req, res) => {
console.log("insertcrop")
    selhoz_model.deleteseason(req.params.project.substr(1),req.params.id.substr(1))
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        })
})

app.get('/api/states/', (req, res) => {
    selhoz_model.getAllstatebyMarkin(req.query)
        .then(response => {
            res.send(response);
        })
        .catch(error => {
            console.log(error);
            res.status(500).send(error);
        })
})


app.get('/api/gps/', (req, res) => {
    selhoz_model.getTargetpoint(req.query)
        .then(response => {
            res.send(response);
        })
        .catch(error => {
            console.log(error);
            res.status(500).send(error);
        })
})

app.get('/api/polygon/', (req, res) => {
	selhoz_model.getGeo(req.query)
	.then(response => {
		console.log(response);

		res.send(response);
		})
	.catch(error => {
		res.status(500).send(error);
})


})

app.get('/api/polygon_lite/', (req, res) => {
	selhoz_model.getGeolite(req.query)
	.then(response => {
		console.log(response);

		res.send(response);
		})
	.catch(error => {
		res.status(500).send(error);
})


})

app.get('/api/polygon_geojson/', (req, res) => {
	selhoz_model.getGeojson(req.query)
	.then(response => {

		res.send(response);
		})
	.catch(error => {
		res.status(500).send(error);
})


})

app.get('/api/polycenter/', (req, res) => {
	selhoz_model.getCentroid(req.query)
	.then(response => {

		res.send(response);
		})
	.catch(error => {
		res.status(500).send(error);
})
})
app.get('/api/childshapes/', (req, res) => {
	selhoz_model.getchildShape(req.query)
	.then(response => {

		res.send(response);
		})
	.catch(error => {
		res.status(500).send(error);
})

})

app.get('/api/distr/', (req, res) => {
selhoz_model.getAlldistrbyMarkin(req.query)
.then(response => {
console.log(response);
res.send(response);
})
.catch(error => {
console.log(error);
res.status(500).send(error);
})
})

app.get('/api/projects/', (req, res) => {
    selhoz_model.getProjectbyMarkin(req.query)
        .then(response => {
            console.log(response);
            res.send(response);
        })
        .catch(error => {
            console.log(error);
            res.status(500).send(error);
        })
})

app.get('/api/subprojects/', (req, res) => {
    selhoz_model.getSubprojectbyMarkin(req.query)
        .then(response => {
            console.log(response);
            res.send(response);
        })
        .catch(error => {
            console.log(error);
            res.status(500).send(error);
        })
})

