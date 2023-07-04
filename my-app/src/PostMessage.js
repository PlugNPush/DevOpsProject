import {Component} from "react"
import React from "react"
import axios from "axios"
axios.defaults.withCredentials = true

class PostMessage extends Component{
    constructor(props){
        super(props)
        this.submit = this.submit.bind(this)
        this.state = {refresh : false}
    }
    submit(event){
        const data = new FormData(event.target)
       
        document.getElementById("newCom").value = ""
        event.preventDefault()

        

        const info = { message : data.get("newCom")}

        

        axios.post("http://localhost:4000/api/messages/user/messages",info,{withCredentials : true})
            .then((res) => {
                this.setState({refresh : !this.state.refresh})
                const button = document.getElementById("addCom")
                button.firstChild.data = "SEND"
                button.style.color = "green"

                setTimeout(function() {
                    button.style.color = "#8044f0"
                    button.firstChild.data = "POST"
                },2000)
            })
            .catch((err) => {
                const button = document.getElementById("addCom")
                button.firstChild.data = "NOT SEND"
                button.style.color = "red"

                setTimeout(function() {
                    button.style.color = "white"
                    button.firstChild.data = "POST"
                },2000)
            })
    }
    render(){
        return <div id="NewMessage">
                    <form id="formMsg" onSubmit={this.submit}>
                        <textarea id="newCom" rows="5" name="newCom" placeholder="  Que racontez vous ajourd'hui ?"></textarea>
                        <button className="bn30" id="addCom" type="submit" >POST</button>
                    </form>
                </div>
    }
}   

export default PostMessage