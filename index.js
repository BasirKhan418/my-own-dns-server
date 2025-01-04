import {startUdpServer,createResponse,createTxtAnswer} from "denamed"
startUdpServer((query)=>{
let question = query.questions[0];
let response = createResponse(query,[createTxtAnswer(question,"Hello basir")]);
return response;
},{port:8080})