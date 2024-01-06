const ws = new WebSocket("ws://localhost:8080/room?name=tisheel&roomId=121212")

// ws.onopen = () => {
//     ws.send(JSON.stringify({event: "CREATE", data: {title: "IA-1",questions: [{question: "this is question",options:['1','2','3','4'],answer: 1}]}}))
// }



ws.onmessage = (e) => {
    console.log(e)
}