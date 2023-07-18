import React from "react";
import { Component } from "react";
import {RiDeleteBinLine} from "react-icons/ri"
import {AiOutlineHeart} from "react-icons/ai"
import {AiFillHeart} from "react-icons/ai"
import {GoComment} from "react-icons/go"
import {AiOutlineRetweet} from "react-icons/ai"

import profil0 from "./img/profil0.jpeg"
import profil1 from "./img/profil1.png"
import profil2 from "./img/profil2.png"
import profil3 from "./img/profil3.png"
import profil4 from "./img/profil4.png"
import profil5 from "./img/profil5.png"
import profil6 from "./img/profil6.png"
import profil7 from "./img/profil7.png"
import profil8 from "./img/profil8.jpeg"

import axios from "axios";
axios.defaults.withCredentials = true;

class Message extends Component{
    constructor(props){
        super(props)
        this.state = {liked : false,isMe:false,pp : -1}
        this.click = this.click.bind(this)
        this.ifLiked = this.ifLiked.bind(this)
        this.delete = this.delete.bind(this)
    }

    getPP(){
        axios.get("https://devopsproject.cyclic.app/api/pp/get/"+this.props.login,{},{withCredentials : true})
        .then((res) => {
            this.setState({pp : res.data.pp})
        })
        .catch((err) => console.log(err)) 
    }

    checkIsMe(){
        axios.get("https://devopsproject.cyclic.app/api/user",{},{withCredentials : true})
        .then((res) => {
            this.setState({isMe : res.data.login === this.props.login})
        })
        .catch((err) => console.log(err))
    }

    componentDidMount(){
        this.checkIsMe()
        this.checkLike()
        this.getPP()
    }

    checkLike(){
        const info = {
            login : this.props.login,
            message : this.props.text
        }
        axios.put("https://devopsproject.cyclic.app/api/messages/user/likes",info,{withCredentials : true})
        .then((res) => this.setState({liked : res.data.liker}))
        .catch((err) => console.log(err.message))

    }

    likeOrDelete(){
        if (!this.state.isMe){
            return this.ifLiked()
        }
        if (!this.props.find) return <RiDeleteBinLine onClick={this.delete} id="delete" className="iconPost"/>
    }

    ifLiked(){
        if (this.state.liked){
            return <AiFillHeart onClick={() => this.click()} id="delike" className="iconPost"/>
        }
        return <AiOutlineHeart onClick={() => this.click()} id="like" className="iconPost"/>
    }

    delete(){
        const info = {
            message : this.props.text
        }
        axios.put("https://devopsproject.cyclic.app/api/messages/user/messages/delete",info,{withCredentials : true})
        .then((res) => {
            this.props.goToProfil(this.props.login)
        })
        .catch((err) => console.log(err))
    }

    click(){
        if (!this.state.liked){
            const info = {
                login : this.props.login,
                message : this.props.text
            }
            axios.put("https://devopsproject.cyclic.app/api/messages/likes",info,{withCredentials : true})
            .then((res) => {
                this.setState({liked : !this.state.liked})
            })
            .catch((err) => console.log(err.message))
        }
        else {
            const info = {
                login : this.props.login,
                message : this.props.text
            }
            axios.put("https://devopsproject.cyclic.app/api/messages/delikes/",info,{withCredentials : true})
            .then((res) => this.setState({liked : !this.state.liked}))
            .catch((err) => console.log(err.message))
        }
    }

    choosePP(){
        if (this.state.pp === 1){
            return <img id="imgprof" onClick={() => this.props.goToProfil(this.props.login)}src={profil1} alt=""/>
        }
        if (this.state.pp === 2){
            return <img id="imgprof" onClick={() => this.props.goToProfil(this.props.login)}src={profil2} alt=""/>
        }
        if (this.state.pp === 3){
            return <img id="imgprof" onClick={() => this.props.goToProfil(this.props.login)}src={profil3} alt=""/>
        }
        if (this.state.pp === 4){
            return <img id="imgprof" onClick={() => this.props.goToProfil(this.props.login)}src={profil4} alt=""/>
        }
        if (this.state.pp === 5){
            return <img id="imgprof" onClick={() => this.props.goToProfil(this.props.login)}src={profil5} alt=""/>
        }
        if (this.state.pp === 6){
            return <img id="imgprof" onClick={() => this.props.goToProfil(this.props.login)}src={profil6} alt=""/>
        }
        if (this.state.pp === 7){
            return <img id="imgprof" onClick={() => this.props.goToProfil(this.props.login)}src={profil7} alt=""/>
        }
        if (this.state.pp === 8){
            return <img id="imgprof" onClick={() => this.props.goToProfil(this.props.login)}src={profil8} alt=""/>
        }

        else{
            return <img id="imgprof" onClick={() => this.props.goToProfil(this.props.login)}src={profil0} alt=""/>
        }
    }

    render(){
        return <div class="post">
<div class="post__avatar">
  {this.choosePP()}
</div>

<div class="post__body">
  <div class="post__header">
    <div class="post__headerText">
      <h3>
      {this.props.login}
      </h3>
    </div>
    <div class="post__headerDescription">
      <p>{this.props.text}</p>
    </div>
  </div>
  <div class="post__footer">
  {this.likeOrDelete()}
  <GoComment className="iconPost"/>
  <AiOutlineRetweet className="iconPost"/>
  </div>
</div>
</div>
    }
}
export default Message