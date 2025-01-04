import { startUdpServer, createResponse, createTxtAnswer } from "denamed";
import{ GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';
const genAI = new GoogleGenerativeAI(process.env.AI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
startUdpServer(async (query) => {
    let question = query.questions[0];
    console.log(question);
    //string parsing
    let prompt = question.name.split(".").join(" ")
    let first = prompt.split(" ")[0];
    let second = prompt.split(" ")[1];
    let each = prompt.split(" ");
    let [a,...rest] = each;
    let actualprompt = rest.join(" ");
    console.log(actualprompt)
    console.log(first, prompt, second)
    //handle calculate
    if (first == "calculate") {
        let van = eval(second);
        let response = createResponse(query, [createTxtAnswer(question, "Answer is " + van)]);
        return response;
    }
    //generate random number
    else if (first == "generate-random") {
        console.log("enter")
        let rand = Math.floor(Math.random() * 1000000)
        let response = createResponse(query, [createTxtAnswer(question, "Random Number is " + rand)]);
        return response;
    }
    //timezone
    else if (first == "timezone") {
        console.log("on time zone");
        try {
            let form = second.replace("/", "%2F").toUpperCase();
            let data = await fetch(`https://timeapi.io/api/time/current/zone?timeZone=${form}`)
            let res = await data.json();
            if (res == "Invalid Timezone") {
                let response = createResponse(query, [createTxtAnswer(question, "Invalid TimeZone")]);
                return response;
            }
            const dateObj = new Date(res.dateTime);

            // Extract time and date components
            const time = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
            const date = `${dateObj.getFullYear()}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${String(dateObj.getDate()).padStart(2, '0')}`;

            // Combine them in the desired format
            const formattedDateTime = `${time}:${date}`;
            console.log(formattedDateTime);
            let response = createResponse(query, [createTxtAnswer(question, "Timezone for " + second + " is " + formattedDateTime)]);
            return response;
        }
        catch (err) {
            let response = createResponse(query, [createTxtAnswer(question, "ERROR OCCURED " + err)]);
            return response;
        }
    }
    //handle ai response
    else if(first=="ai"){
        try{
        const prompt = `Instruction:Answer in one word or in one sentence if it required donot generate too much content
        Question is ${actualprompt}
        `

        const result = await model.generateContent(prompt);
        let ans = result.response.text();
        console.log(ans)
        let response = createResponse(query, [createTxtAnswer(question, ans)]);
        return response;
        }
        catch(err){
            let response = createResponse(query, [createTxtAnswer(question, "Sorry we can not process your request at this time. We are facing heavy traffic.")]);
        return response;
        }
    }
    else {
        let response = createResponse(query, [createTxtAnswer(question, "Couldnot Follow the format or can't get any response")]);
        return response;
    }

}, { port: 8080 })
