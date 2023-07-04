import React from "react";
import { Component } from "react";
import axios from "axios";
import ListMessage from "./ListMessage"
import ListFriend from "./ListFriend";
import Stat from "./Stat"

import profil0 from "./img/profil0.jpeg"
import profil1 from "./img/profil1.png"
import profil2 from "./img/profil2.png"
import profil3 from "./img/profil3.png"
import profil4 from "./img/profil4.png"
import profil5 from "./img/profil5.png"
import profil6 from "./img/profil6.png"
import profil7 from "./img/profil7.png"
import profil8 from "./img/profil8.jpeg"


import {MdModeEditOutline} from "react-icons/md"
axios.defaults.withCredentials = true;

class Profil extends Component{
    constructor(props){
        super(props)
        this.state = {nbM : 0,followed : false,isMe : false,pp : -1,bio : ""}
        this.following = this.following.bind(this)
        this.getIfFollow = this.getIfFollow.bind(this)
        this.isMe = this.isMe.bind(this)
        this.onClick = this.onClick.bind(this)
        this.click = this.click.bind(this)
        this.getPP = this.getPP.bind(this)
        this.choosePP = this.choosePP.bind(this)
        this.getBIO = this.getBIO.bind(this)
    }

    getPP(){
        axios.get("http://localhost:4000/api/pp/get/"+this.props.login,{},{withCredentials : true})
        .then((res) => {
            this.setState({pp : res.data.pp})
        })
        .catch((err) => console.log(err)) 
    }

    getBIO(){
        axios.get("http://localhost:4000/api/bio/get/"+this.props.login,{},{withCredentials : true})
        .then((res) => {
            console.log(res.data)
            this.setState({bio : res.data.bio})
        })
        .catch((err) => console.log(err)) 
    }

    componentDidMount(){
        this.isMe()
        this.getIfFollow()
        this.getPP()
        this.getBIO()

        axios.get("http://localhost:4000/api/messages/user/"+this.props.login+"/messages/",{},{withCredentials : true})
        .then((res) => {
            this.setState({nbM : res.data.listMessages.length})
        })
        .catch((err) => console.log(err))
    }
    following(){
        if (this.state.isMe) return
        if(this.state.followed){
            return <button className="bn30" id="followed" type="button" onClick={() => this.onClick()}><span id="buttonText">Followed</span></button>
        }
        else{
            return <button className="bn30" id="followed" type="button" onClick={() => this.onClick()}>Follow</button>
        }
    }
    isMe(){
        console.log(this.props.login)
        axios.get("http://localhost:4000/api/user",{},{withCredentials : true})
        .then((res) => {
            if (this.props.login === res.data.login) this.setState({isMe : true})
        })
        .catch((err) => console.log(err))
    }
    getIfFollow(){
        if (this.state.isMe) return
        axios.get("http://localhost:4000/api/friend/user/friends/"+this.props.login,{},{withCredentials : true})
        .then((res) => {
            if (res.data.status === 200) this.setState({followed : true})
        })
        .catch((err) => console.log(err))
    }
    onClick(){
        if (!this.state.followed){
            axios.put("http://localhost:4000/api/friend/user/"+this.props.login+"/friends",{},{withCredentials : true})
            .catch((err) => console.log(err))
        }
        else{

            axios.delete("http://localhost:4000/api/friend/user/friends/"+this.props.login,{},{withCredentials : true})
            .catch((err) => console.log(err))
        }
        this.setState({followed : !this.state.followed})
    }

    click(){
        this.props.edit()
    }

    choosePP(){
        if (this.state.pp === 1){
            return <img id="imgPROFIL" onClick={() => this.props.goToProfil(this.props.login)}src={profil1} alt=""/>
        }
        if (this.state.pp === 2){
            return <img id="imgPROFIL" onClick={() => this.props.goToProfil(this.props.login)}src={profil2} alt=""/>
        }
        if (this.state.pp === 3){
            return <img id="imgPROFIL" onClick={() => this.props.goToProfil(this.props.login)}src={profil3} alt=""/>
        }
        if (this.state.pp === 4){
            return <img id="imgPROFIL" onClick={() => this.props.goToProfil(this.props.login)}src={profil4} alt=""/>
        }
        if (this.state.pp === 5){
            return <img id="imgPROFIL" onClick={() => this.props.goToProfil(this.props.login)}src={profil5} alt=""/>
        }
        if (this.state.pp === 6){
            return <img id="imgPROFIL" onClick={() => this.props.goToProfil(this.props.login)}src={profil6} alt=""/>
        }
        if (this.state.pp === 7){
            return <img id="imgPROFIL" onClick={() => this.props.goToProfil(this.props.login)}src={profil7} alt=""/>
        }
        if (this.state.pp === 8){
            return <img id="imgPROFIL" onClick={() => this.props.goToProfil(this.props.login)}src={profil8} alt=""/>
        }

        else{
            return <img id="imgPROFIL" onClick={() => this.props.goToProfil(this.props.login)}src={profil0} alt=""/>
        }
    }

    render(){
        return <div>
            
        <div className="Profil">
                <div className="Gauche">
                <div className="Bio">
                    <div className="infoProfil">
                        {this.choosePP()}{this.state.isMe ? <MdModeEditOutline onClick={this.click}id="ediPic"/> : <span></span>}
                        <span className="NameProfil">{this.props.login}</span>
                        {this.following()}
                    </div>
                    <div className="bioText"> {this.state.isMe ? <MdModeEditOutline id="editBIO" onClick={this.props.editBIO}/>  : <span></span> }<p id="text">{this.state.bio}</p></div>
                </div>
                <ListMessage goToProfil={this.props.goToProfil} key={this.props.login + this.state.nbM} login={this.props.login}/>
            </div>
            <div className="Droite">
                 <ListFriend login={this.props.login} goToProfil={this.props.goToProfil}/>
                 <Stat login={this.props.login}/>
            </div>
            </div>
            </div>
    }
}

export default Profil