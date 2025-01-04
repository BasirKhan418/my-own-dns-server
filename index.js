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
    //for tutorial
    else if(first=="tutorial"){
        try{
            const prompt = `You have this json
            {
    "title":"Javascript Interview Questions and Preparation",
    "link":"https://youtube.com/playlist?list=PLinedj3B30sDi0keEOQU3n5p3Op28eN2e&si=fsP5QXdiiGEvTqDG"
},
{
    "title":"Rust Programming Language",
    "link":"https://youtube.com/playlist?list=PLinedj3B30sA_M0oxCRgFzPzEMX3CSfT5&si=PP6xilMhR1mf3u-J"
},
{
    "title":"The Rust Book | Rust Programming Language",
    "link":"https://www.youtube.com/playlist?list=PLinedj3B30sAnCkwmMb5Ape5Ibqp0R5bP"
},
{
    "title":"Build Your Own X",
    "link":"https://www.youtube.com/playlist?list=PLinedj3B30sC3VyfC7xD_ILyGvlHunoQs"
},
{
    "title":"Complete Git and GitHub Tutorial",
    "link":"https://www.youtube.com/playlist?list=PLinedj3B30sCoLe5k0FWtFd-JykESyu6h"
},
{
    "title":"Open Source Contributions Guide",
    "link":"https://www.youtube.com/playlist?list=PLinedj3B30sBsmRRL8XyTGadjRGkzRPb7"
},
{
    "title":"AWS - Amazon Web Services",
    "link":"https://www.youtube.com/playlist?list=PLinedj3B30sDZ17Fpe3xGUDRBkutaGyUp"
},
{
    "title":"Serverless",
    "link":"https://www.youtube.com/playlist?list=PLinedj3B30sA0V3kLZoV0qEo5nOLyRjYA"
},
{
    "title":"Master ReactJS",
    "link":"https://www.youtube.com/playlist?list=PLinedj3B30sBm5wu3ixPRQ0gDqHJUlxQf"
},
{
    "title":"Nginx",
    "link":"https://www.youtube.com/playlist?list=PLinedj3B30sCbKdDspcuD3T6zFWPXzsNt"
},
{
    "title":"Master NodeJS",
    "link":"https://www.youtube.com/playlist?list=PLinedj3B30sDby4Al-i13hQJGQoRQDfPo"
},
{
    "title":"Advance Javascript Concepts",
    "link":"https://www.youtube.com/playlist?list=PLinedj3B30sCZRV74kZrnOXU9zVdKY68w"
},
{
    "title":"WebRTC | Video Calling",
    "link":"https://www.youtube.com/playlist?list=PLinedj3B30sDxXVu4VXdFx678W2pJmORa"
},
{
    "title":"Ultimate Javascript Tutorials",
    "link":"https://www.youtube.com/playlist?list=PLinedj3B30sDFRdgPYvjnBs2JsDdHPIMv"
},
{
    "title":"Docker | Beginners",
    "link":"https://www.youtube.com/playlist?list=PLinedj3B30sDvBfeK9EPz9pcJNlM0f3ph"
},
{
    "title":"NextJS Master Course",
    "link":"https://www.youtube.com/playlist?list=PLinedj3B30sDP2CHN5P0lDD64yYZ0Nn4J"
},
{
    "title":"Redux Tutorial For Beginners",
    "link":"https://www.youtube.com/playlist?list=PLinedj3B30sCvNf_MYSt4ENJN7cOHGIdT"
},
{
    "title":"OOPS with Java",
    "link":"https://www.youtube.com/playlist?list=PLinedj3B30sCoHBdM-S7Ang7WERCCuftE"
},
{
    "title":"Java Tutorial Series in Hindi",
    "link":"https://www.youtube.com/playlist?list=PLinedj3B30sBbrPUH6YFBhpFpjSnAKHTY"
},
{
    "title":"Firebase with Reactjs | Complete Firebase ",
    "link":"https://www.youtube.com/playlist?list=PLinedj3B30sBbrPUH6YFBhpFpjSnAKHTY"
},
{
    "title":"Complete React Tutorial Series in Hindi | Reactjs",
    "link":"https://www.youtube.com/playlist?list=PLinedj3B30sCHqHtgbjg1lSYgWebm1dyI"
}
    based on this json title and link are there . Based on this title of every json generate most appropriate link for this question if not found any relavancy generate "NOT FOUND IN PIYUSH GARG PLAYLIST" Other wise generate in this format Title:"",Link:"",.Donot generate any extra information.
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
    //for courses
    //for tutorial
    else if(first=="course"){
        try{
            const prompt = `You have this json
            {
    "title":"Docker - Containerisation for Modern Development",
    "link":"https://pro.piyushgarg.dev/learn/docker"
}
{
    "title":"Full Stack Twitter Clone",
    "link":"https://learn.piyushgarg.dev/learn/twitter-clone"
}
{
    "title":"Master NextJS 14",
    "link":"https://learn.piyushgarg.dev/learn/nextjs-14"
}
{
    "title":"Web Dev Cohort",
    "link":"https://www.piyushgarg.dev/cohort"
}
     based on this json title and link are there . Based on this title of every json generate most appropriate link for this question if not found any relavancy generate "NOT FOUND IN PIYUSH COURSE" Other wise generate in this format Title:"",Link:"",.Donot generate any extra information.
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
