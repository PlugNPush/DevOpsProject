import React from "react";
import { Component } from "react";
import {GiCancel} from "react-icons/gi"
import "./Form.css"
import {ImCross} from 'react-icons/im'
import {ImProfile}  from 'react-icons/im'
import {RiLockPasswordFill} from "react-icons/ri"
import {AiOutlineUser} from "react-icons/ai"
import {MdOutlinePassword} from "react-icons/md"
import axios from "axios"
axios.defaults.withCredentials = true

class SigninForm extends Component{
    constructor(props){
        super(props)
        this.state = {notWrong:false , touched : false,champM : false,loginUse : false}
        this.submit = this.submit.bind(this)
    }

    submit(event){
        const data = new FormData(event.target)
        event.preventDefault()

        if (!this.state.wrong){
            const info = {
                login: data.get("login"),
                password: data.get("password"),
                lastname: data.get("nom"),
                firstname: data.get("prenom")
            }
            axios.put("https://devopsproject.cyclic.app/api/user",info,{withCredentials : true})
            .then((res) => this.props.goBack())
            .catch((err) => {
                if (err.toJSON().status === 400){
                    this.setState({champM : true,loginUse : false})
                }
                else{
                    this.setState({champM : false,loginUse : true})

                }
            })
        }
    }

    comparePassword(){
        this.setState({touched : true})
        if(this.firstInput.value === this.secondInput.value){
            this.setState({notWrong:true})
        }
        else
            this.setState({notWrong : false})
    }
    affichagePassWord(){
        if(this.state.touched){
            if(this.state.notWrong){
            }
            else{
                return <div className="Error"><label id="CheckPass"><ImCross/>Wrong Password</label></div>
            }
        }
    }
    changement(e){
        this.comparePassword(e)
        this.affichagePassWord()
    }
    render(){
        return <div id="main">
            <GiCancel id="cancelIcon" onClick={this.props.goBack}/>
        <form className="form" id="formSign" onSubmit={this.submit}>
        <div className="field">
            <div id="PrenomID" className="infoP">
                <div className="iconHolder">
                    <ImProfile className="icons"/>
                </div>
                <input id="prenom" className="champ" name="prenom" type="text" placeholder="Prenom"/>
            </div>
            <div className="infoP">
                <div className="iconHolder">
                    <ImProfile className="icons"/>
                </div>
                <input id="nom" className="champ" name="nom" type="text" placeholder="Nom"/>
            </div>
            <div className="infoP">
                <div className="iconHolder">
                    <AiOutlineUser className="icons"/>
                </div>
                <input id="login" className="champ" name="login" type="text" placeholder="Login"/>
            </div>
            <div className="infoP">
                <div className="iconHolder">
                    <RiLockPasswordFill className="icons"/>
                </div>
                <input id="password" className="champ" name="password" type="password" ref={input => { this.firstInput = input }} placeholder="Password"/>
            </div>
            <div className="infoP">
            <div className="iconHolder">
                <MdOutlinePassword className="icons"/>
            </div>
            <input id="retapez" className="champ" name="retapez" ref={input => { this.secondInput = input }} onChange={() => this.comparePassword()} type="password" placeholder="Confirm"/>
            </div>
        </div>
        <div>
            {this.affichagePassWord()}
            {this.state.champM ? <div className="Error"><span id="CheckPass">Champ(s) manquants</span></div> : <span></span>}
            {this.state.loginUse? <div className="Error"><span id="CheckPass">Login deja prit</span></div> : <span></span>}
        </div>
        <div id="buttonHolder">
            <button id="Bins" className="bn39" type="submit"><span class="bn39span">Inscription</span></button>
        </div>
        </form>
    </div>
    }
}

export default SigninForm