const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080
// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser());
const { connection } = require('./connector')
const arrdata=require("./data");
const { ReplSet } = require('mongodb');

app.get("/totalRecovered",async (req,res)=>{
    try{
        let total=0;
        const recoveredData= await arrdata;
        for(let i=0;i<(recoveredData.data).length;i++){
            const rec=recoveredData.data[i].recovered;
            total+=rec;
        }
        console.log(total)
        res.json({
            status:"success",
            data: {_id: "total", recovered:total}
        })
    }catch(e){
        res.status(400).json({
            status:"Failure",
            message:e.message
        })
    }
})
app.get("/totalActive",async (req,res)=>{
    try{
        let total=0;
        const recoveredData= await arrdata;
        for(let i=0;i<(recoveredData.data).length;i++){
            const rec=recoveredData.data[i].infected;
            total+=rec;
        }
        console.log(total)
        res.json({
            status:"success",
            data: {_id: "total", active:total}
        })
    }catch(e){
        res.status(400).json({
            status:"Failure",
            message:e.message
        })
    }
})
app.get("/totalDeath",async (req,res)=>{
    try{
        let total=0;
        const recoveredData= await arrdata;
        for(let i=0;i<(recoveredData.data).length;i++){
            const rec=recoveredData.data[i].death;
            total+=rec;
        }
        console.log(total)
        res.json({
            status:"success",
            data: {_id: "total", death:total}
        })
    }catch(e){
        res.status(400).json({
            status:"Failure",
            message:e.message
        })
    }
})
app.get("/hotspotStates",async (req,res)=>{
    try{
        let states=[];
        const recoveredData= await arrdata;
        for(let i=0;i<(recoveredData.data).length;i++){
            let rec=((recoveredData.data[i].infected-recoveredData.data[i].recovered)/recoveredData.data[i].infected).toFixed(5);
            if(rec>0.1){
            states.push(`{states:${recoveredData.data[i].state},rate: ${rec}}`);
            }
        }
        console.log(states)
        res.json({
            status:"success",
            data: {states:states}
        })
    }catch(e){
        res.status(400).json({
            status:"Failure",
            message:e.message
        })
    }
})
app.get("/healthyStates",async (req,res)=>{
    try{
        let states=[];
        const recoveredData= await arrdata;
        for(let i=0;i<(recoveredData.data).length;i++){
            let rec=((recoveredData.data[i].death)/recoveredData.data[i].infected).toFixed(5);
            if(rec<0.005){
            states.push(`{states:${recoveredData.data[i].state},mortality: ${rec}}`);
            }
        }
        console.log(states)
        res.json({
            status:"success",
            data: {states:states}
        })
    }catch(e){
        res.status(400).json({
            status:"Failure",
            message:e.message
        })
    }
})
app.listen(port, () => console.log(`App listening on port ${port}!`))
module.exports = app;