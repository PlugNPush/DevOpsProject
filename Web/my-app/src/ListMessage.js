import React from "react";
import { Component } from "react";
import Message from "./Message"
import axios from "axios"
axios.defaults.withCredentials = true


class ListMessage extends Component {
    constructor(props) {
        super(props)
        this.state = { messages: [] }
    }
    componentDidMount() {
        this.getAllMessage()
    }
    getAllMessage() {

        if (this.props.find) {
            const info = { keyword: this.props.find }

            axios.put("http://localhost:4000/api/messages/all", info, { withCredentials: true })
                .then((res) => {
                    console.log(res.data)
                    var ls = []
                    for (let i = 0; i < res.data.message.length; i++) {
                        ls.push({ login: res.data.message[i].login, text: res.data.message[i].message })
                    }
                    if (ls.length === 0) {
                        ls.push({ login: "", text: "Aucun résultat ..." })
                    }
                    this.setState({ messages: ls })
                })
                .catch((err) => console.log(err))
        } else {
            if (this.props.login === undefined) {
                this.getMessageFriend()
            } else {
                this.getMessageUser()
            }
        }

    }

    getMessageFriend() {
        var ls = []

        axios.get("http://localhost:4000/api/messages/user/messages/friends", {}, { withCredentials: true })
            .then((res) => {
                for (let i = 0; i < res.data.messages.length; i++) {
                    for (let k = 0; k < res.data.messages[i].message.length; k++) {
                        ls.push({ login: res.data.messages[i].loginFriend, text: res.data.messages[i].message[k] })
                    }
                }
                this.setState({ messages: ls })

            })
            .catch((err) => console.log(err))
    }


    getMessageUser() {
        var ls = []

        axios.get("http://localhost:4000/api/messages/user/" + this.props.login + "/messages/", {}, { withCredentials: true })
            .then((res) => {
                for (let i = 0; i < res.data.listMessages.length; i++) {
                    ls.push({ login: this.props.login, text: res.data.listMessages[i] })
                }
                this.setState({ messages: ls })

            })
            .catch((err) => console.log(err))
    }

    render() {
        return <div className = "postContener" >
            <
            div className = "ListMessage" > {
                this.state.messages.map(({ login, text }) => ( <
                    Message key = { login + text }
                    find = { this.props.find }
                    text = { text }
                    login = { login }
                    goToProfil = { this.props.goToProfil }
                    />
                ))
            } <
            /div> <
            /div>
    }
}

/*<div>
            <div className="ListMessage">{
                this.state.messages.map(({login,text}) => (
                    <Message key={login + text} find={this.props.find} text={text} login={login} goToProfil={this.props.goToProfil}/>
                ))}
            </div>
        </div>*/

export default ListMessage